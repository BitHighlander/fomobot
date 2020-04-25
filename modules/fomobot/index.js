/*
 Main bot client

 Ported from Zenbot

 supported strats

 ML trading
 //s.options.strategy =  'forex_analytics'

 Traditional Strats

 //s.options.strategy =  'bollinger'
 //s.options.strategy =  'cci_srsi'
 //s.options.strategy =  'crossover_vwap'
 //s.options.strategy =  'dema'
 //s.options.strategy =  'ichimoku_score'
 //s.options.strategy =  'ichimoku'
 //s.options.strategy =  'speed'
 //s.options.strategy =  'wavetrend'
 //s.options.strategy =  'trust_distrust'
 //s.options.strategy =  'ta_ultosc' //very active!
 //s.options.strategy =  'stddev'

 //broke
 //s.options.strategy =  'trendline' //????
 //s.options.strategy =  'renko' //BROKE



 Intake trades

 Push recommendations

 So Simple, yet so much magic

 */

const TAG = " | Fomobot | "

let log = require("@fomobro/loggerdog-client")()
let EventEmitter = require('events')
const db = require('monk')('localhost/zenbot4')
//const tradesDB = db.get('trades')
let engineFactory = require('./lib/engine')
let path = require('path')
var z = require('zero-fill')
    , n = require('numbro')
    , rsi = require('./lib/rsi')
    , ultosc = require('./lib/ta_ultosc')
    , Phenotypes = require('./lib/phenotype')


var tb = require('timebucket')
    , crypto = require('crypto')
    , objectifySelector = require('./lib/objectify-selector')
    , collectionService = require('./lib/services/collection-service')

let STRATEGY
let ENGINE

module.exports = {
    health: function() {
        return get_health();
    },
    init: function(strategy) {
        return init_bot(strategy);
    },
    load: function(trades) {
        return load_trades(trades);
    },
    push: function(trade) {
        return push_trade(trade);
    },
    backfill: function() {
        return backfill_trade_data();
    },
};

/********************************
 //function primary
 //********************************/

let backfill_trade_data =  async function (trades) {
    let tag = TAG + " | backfill_trade_data | "
    try{

        //

        var EventEmitter = require('events')
        var eventBus = new EventEmitter()
        var conf = require('./conf')
        let zenbot = {}
        zenbot.conf = conf
        conf.eventBus = eventBus
        conf.db = {}
        conf.db.mongo = db
        log.debug(conf.db)

        let cmd = {}

        cmd.days = 10

        selector = objectifySelector(conf.selector)
        log.info("selector: ",selector)


        //var exchange = require(`../../extensions/exchanges/${selector.exchange_id}/exchange`)(conf)
        var exchange = require(`./extensions/exchanges/bitmex/exchange`)(conf)

        if (!exchange) {
            console.error('cannot backfill ' + selector.normalized + ': exchange not implemented')
            process.exit(1)
        }

        var collectionServiceInstance = collectionService(conf)
        var tradesCollection = collectionServiceInstance.getTrades()
        var resume_markers = collectionServiceInstance.getResumeMarkers()

        var marker = {
            id: crypto.randomBytes(4).toString('hex'),
            selector: selector.normalized,
            from: null,
            to: null,
            oldest_time: null,
            newest_time: null
        }
        log.info("marker: ",marker)


        marker._id = marker.id
        var trade_counter = 0
        var day_trade_counter = 0
        var get_trade_retry_count = 0
        var days_left = cmd.days + 1
        var target_time, start_time
        var last_batch_id, last_batch_opts
        var offset = exchange.offset
        var markers, trades


        var mode = exchange.historyScan
        if (!mode) {
            console.error('cannot backfill ' + selector.normalized + ': exchange does not offer historical data')
            process.exit(0)
        }
        log.info("mode: ",mode)

        //TODO what is backward? is bitmex backward???
        if (mode === 'backward') {
            target_time = new Date().getTime() - (86400000 * cmd.days)
        } else {
            if (cmd.start >= 0 && cmd.end >= 0) {
                start_time = cmd.start
                target_time = cmd.end
            } else {
                target_time = new Date().getTime()
                start_time = new Date().getTime() - (86400000 * cmd.days)
            }
        }

        resume_markers.find({selector: selector.normalized}).toArray(function (err, results) {
            if (err) throw err
            markers = results.sort(function (a, b) {
                if (mode === 'backward') {
                    if (a.to > b.to) return -1
                    if (a.to < b.to) return 1
                } else {
                    if (a.from < b.from) return -1
                    if (a.from > b.from) return 1
                }
                return 0
            })
            getNext()
        })

        function getNext() {
            var opts = {product_id: selector.product_id}

            log.info("marker: ",marker)

            if(!marker.to){
                marker.to = moment(new Date()).toISOString();
                opts.to = marker.to
            }

            if(!marker.from){
                let tenMinAgo = moment(new Date()).subtract(4, 'h')
                marker.from =  moment(new Date(tenMinAgo)).toISOString()
                opts.from = marker.from
            }

            if(marker.oldest_time){
                log.debug("move time back!")
                opts.to = moment(last_batch_opts.from).toISOString()
                opts.from = moment(new Date(last_batch_opts.from)).subtract(1, 'h').toISOString()
            }
            marker.oldest_time = opts.from
            log.debug("opts: ",opts)

            last_batch_opts = opts

            exchange.getTrades(opts, function (err, results) {
                trades = results
                if (err) {
                    console.error('err backfilling selector: ' + selector.normalized)
                    console.error(err)
                    if (err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND' || err.code === 'ECONNRESET') {
                        console.error('retrying...')
                        setImmediate(getNext)
                        return
                    }
                    console.error('aborting!')
                    process.exit(1)
                }
                if (mode !== 'backward' && !trades.length) {
                    if (trade_counter) {
                        log.debug('\ndownload complete!\n')
                        process.exit(0)
                    } else {
                        if (get_trade_retry_count < 5) {
                            console.error('\ngetTrades() returned no trades, retrying with smaller interval.')
                            get_trade_retry_count++
                            start_time += (target_time - start_time) * 0.4
                            setImmediate(getNext)
                            return
                        } else {
                            console.error('\ngetTrades() returned no trades, --start may be too remotely in the past.')
                            process.exit(1)
                        }
                    }
                } else if (!trades.length) {
                    log.info('\ngetTrades() returned no trades, we may have exhausted the historical data range.')
                    //process.exit(0)
                    getNext()
                }
                trades.sort(function (a, b) {
                    if (mode === 'backward') {
                        if (a.time > b.time) return -1
                        if (a.time < b.time) return 1
                    } else {
                        if (a.time < b.time) return -1
                        if (a.time > b.time) return 1
                    }
                    return 0
                })
                if (last_batch_id && last_batch_id === trades[0].trade_id) {
                    console.error('\nerror: getTrades() returned duplicate results')
                    console.error(opts)
                    console.error(last_batch_opts)
                    //process.exit(0)
                }
                last_batch_id = trades[0].trade_id
                runTasks(trades)
            })
        }

        function runTasks(trades) {
            Promise.all(trades.map((trade) => saveTrade(trade))).then(function (/*results*/) {
                var oldest_time = marker.oldest_time
                var newest_time = marker.newest_time
                markers.forEach(function (other_marker) {
                    // for backward scan, if the oldest_time is within another marker's range, skip to the other marker's start point.
                    // for forward scan, if the newest_time is within another marker's range, skip to the other marker's end point.
                    if (mode === 'backward' && marker.id !== other_marker.id && marker.from <= other_marker.to && marker.from > other_marker.from) {
                        marker.from = other_marker.from
                        marker.oldest_time = other_marker.oldest_time
                    } else if (mode !== 'backward' && marker.id !== other_marker.id && marker.to >= other_marker.from && marker.to < other_marker.to) {
                        marker.to = other_marker.to
                        marker.newest_time = other_marker.newest_time
                    }
                })
                var diff
                if (oldest_time !== marker.oldest_time) {
                    diff = tb(oldest_time - marker.oldest_time).resize('1h').value
                    log.debug('\nskipping ' + diff + ' hrs of previously collected data')
                } else if (newest_time !== marker.newest_time) {
                    diff = tb(marker.newest_time - newest_time).resize('1h').value
                    log.debug('\nskipping ' + diff + ' hrs of previously collected data')
                }
                resume_markers.save(marker)
                    .then(setupNext)
                    .catch(function (err) {
                        if (err) throw err
                    })
            }).catch(function (err) {
                if (err) {
                    console.error(err)
                    console.error('retrying...')
                    return setTimeout(runTasks, 10000, trades)
                }
            })
        }

        function setupNext() {
            let tag = TAG + " | setupNext | "
            trade_counter += trades.length
            day_trade_counter += trades.length
            log.info(tag,"trade_counter: ",trade_counter)
            log.info(tag,"day_trade_counter: ",day_trade_counter)

            var current_days_left = 1 + (mode === 'backward' ? tb(marker.oldest_time - target_time).resize('1d').value : tb(target_time - marker.newest_time).resize('1d').value)

            if (current_days_left >= 0 && current_days_left != days_left) {
                log.info('\n' + selector.normalized, 'saved', day_trade_counter, 'trades', current_days_left, 'days left')
                day_trade_counter = 0
                days_left = current_days_left
            } else {
                process.stdout.write('.')
            }

            if (exchange.backfillRateLimit) {
                setTimeout(getNext, exchange.backfillRateLimit)
            } else {
                setImmediate(getNext)
            }
        }

        function saveTrade(trade) {
            trade.id = selector.normalized + '-' + String(trade.trade_id)
            trade._id = trade.id
            trade.selector = selector.normalized
            return tradesCollection.save(trade)
        }

        //

        return true
    }catch(e){
        console.error(tag,"Error: ",e)
        throw e
    }
}


let load_trades =  async function (trades) {
    let tag = TAG + " | get_current_usd | "
    try{

        ENGINE.update(trades,true,function(err){
            if(err) throw Error(error)
        })

        return true
    }catch(e){
        console.error(tag,"Error: ",e)
        throw e
    }
}


let init_bot =  async function (strategy) {
    let tag = TAG + " | init_bot | "
    try{
        STRATEGY = strategy

        let modelPath =  "/home/highlander/WebstormProjects/fomo-core/services/trade/models/temp.06386bd67dd782a007ba18193c5bfa4f4e6fd42a57849b3db7b5ba911f1eb9db-20190927_040010+0000.json"


        let eventBus = new EventEmitter()
        let conf = require('./conf')
        conf.eventBus = eventBus
        conf.db = {}
        conf.db.mongo = db

        let s = {
            selector:
                {
                    exchange_id: 'bitmex',
                    product_id: 'BTC-USD',
                    asset: 'BTC',
                    currency: 'USD',
                    normalized: 'bitmex.BTC-USD'
                },
            options: {
                selector:
                    {
                        exchange_id: 'bitmex',
                        product_id: 'BTC-USD',
                        asset: 'BTC',
                        currency: 'USD',
                        normalized: 'bitmex.BTC-USD'
                    },
                paper: true,
                min_periods:100,
                period_length: "1m",
                modelfile:modelPath
            },
        }

        s.options.strategy =  'bollinger' //very active!
        //s.strategy = require(p)
        //s.strategy = require('/home/highlander/WebstormProjects/fomobot/modules/fomobot/extensions/strategies/bollinger/strategy.js')

        let z = require('zero-fill')
            , n = require('numbro')
            , bollinger = require('./lib/bollinger')
            , Phenotypes = require('./lib/phenotype')

        s.strategy = {
            name: 'bollinger',
            description: 'Buy when (Signal ≤ Lower Bollinger Band) and sell when (Signal ≥ Upper Bollinger Band).',

            getOptions: function () {
                this.option('period', 'period length, same as --period_length', String, '1h')
                this.option('period_length', 'period length, same as --period', String, '1h')
                this.option('bollinger_size', 'period size', Number, 20)
                this.option('bollinger_time', 'times of standard deviation between the upper band and the moving averages', Number, 2)
                this.option('bollinger_upper_bound_pct', 'pct the current price should be near the bollinger upper bound before we sell', Number, 0)
                this.option('bollinger_lower_bound_pct', 'pct the current price should be near the bollinger lower bound before we buy', Number, 0)
            },

            calculate: function (s) {
                // calculate Bollinger Bands
                bollinger(s, 'bollinger', s.options.bollinger_size)
            },

            onPeriod: function (s, cb) {
                if (s.period.bollinger) {
                    if (s.period.bollinger.upperBound && s.period.bollinger.lowerBound) {
                        let upperBound = s.period.bollinger.upperBound
                        let lowerBound = s.period.bollinger.lowerBound
                        if (s.period.close > (upperBound / 100) * (100 - s.options.bollinger_upper_bound_pct)) {
                            s.signal = 'sell'
                        } else if (s.period.close < (lowerBound / 100) * (100 + s.options.bollinger_lower_bound_pct)) {
                            s.signal = 'buy'
                        } else {
                            s.signal = null // hold
                        }
                    }
                }
                cb()
            },

            onReport: function (s) {
                var cols = []
                if (s.period.bollinger) {
                    if (s.period.bollinger.upperBound && s.period.bollinger.lowerBound) {
                        let upperBound = s.period.bollinger.upperBound
                        let lowerBound = s.period.bollinger.lowerBound
                        var color = 'grey'
                        if (s.period.close > (upperBound / 100) * (100 - s.options.bollinger_upper_bound_pct)) {
                            color = 'green'
                        } else if (s.period.close < (lowerBound / 100) * (100 + s.options.bollinger_lower_bound_pct)) {
                            color = 'red'
                        }
                        cols.push(z(8, n(s.period.close).format('+00.0000'), ' ')[color])
                        cols.push(z(8, n(lowerBound).format('0.000000').substring(0,7), ' ').cyan)
                        cols.push(z(8, n(upperBound).format('0.000000').substring(0,7), ' ').cyan)
                    }
                }
                else {
                    cols.push('         ')
                }
                return cols
            },

            phenotypes: {
                // -- common
                period_length: Phenotypes.RangePeriod(1, 120, 'm'),
                markdown_buy_pct: Phenotypes.RangeFloat(-1, 5),
                markup_sell_pct: Phenotypes.RangeFloat(-1, 5),
                order_type: Phenotypes.ListOption(['maker', 'taker']),
                sell_stop_pct: Phenotypes.Range0(1, 50),
                buy_stop_pct: Phenotypes.Range0(1, 50),
                profit_stop_enable_pct: Phenotypes.Range0(1, 20),
                profit_stop_pct: Phenotypes.Range(1,20),

                // -- strategy
                bollinger_size: Phenotypes.Range(1, 40),
                bollinger_time: Phenotypes.RangeFloat(1,6),
                bollinger_upper_bound_pct: Phenotypes.RangeFloat(-1, 30),
                bollinger_lower_bound_pct: Phenotypes.RangeFloat(-1, 30)
            }
        }

        // s.strategy = {
        //     name: 'ta_ultosc',
        //     description: 'ULTOSC - Ultimate Oscillator with rsi oversold',
        //
        //     getOptions: function () {
        //         this.option('period', 'period length eg 5m', String, '5m')
        //         this.option('min_periods', 'min. number of history periods', Number, 52)
        //         this.option('signal', 'Provide signal and indicator "simple" (buy@65, sell@50), "low" (buy@65, sell@30), "trend" (buy@30, sell@70)', String, 'simple')
        //         this.option('timeperiod1', 'talib ULTOSC timeperiod1', Number, 7)
        //         this.option('timeperiod2', 'talib ULTOSC timeperiod2', Number, 14)
        //         this.option('timeperiod3', 'talib ULTOSC timeperiod3', Number, 28)
        //         this.option('overbought_rsi_periods', 'number of periods for overbought RSI', Number, 25)
        //         this.option('overbought_rsi', 'sold when RSI exceeds this value', Number, 90)
        //     },
        //
        //     calculate: function (s) {
        //         if (s.options.overbought_rsi) {
        //             // sync RSI display with overbought RSI periods
        //             s.options.rsi_periods = s.options.overbought_rsi_periods
        //             rsi(s, 'overbought_rsi', s.options.overbought_rsi_periods)
        //             if (!s.in_preroll && s.period.overbought_rsi >= s.options.overbought_rsi && !s.overbought) {
        //                 s.overbought = true
        //
        //                 if (s.options.mode === 'sim' && s.options.verbose) {
        //                     console.log(('\noverbought at ' + s.period.overbought_rsi + ' RSI, preparing to sold\n').cyan)
        //                 }
        //             }
        //         }
        //     },
        //
        //     onPeriod: function (s, cb) {
        //         if (!s.in_preroll && typeof s.period.overbought_rsi === 'number') {
        //             if (s.overbought) {
        //                 s.overbought = false
        //                 s.signal = 'sell'
        //                 return cb()
        //             }
        //         }
        //
        //         ultosc(s, s.options.min_periods, s.options.timeperiod1, s.options.timeperiod2, s.options.timeperiod3).then(function(signal) {
        //             s.period['ultosc'] = signal
        //
        //             let t = s.signales || {}
        //
        //             var signals = {
        //                 bottom: t.bottom || 0, // 30 line
        //                 top: t.top || 0, // 70 line
        //             }
        //
        //             if (s.period.ultosc && s.period.ultosc > 0) {
        //
        //                 if (s.options.signal == 'simple') {
        //                     // use defensive indicator trigger
        //
        //                     if (s.period.ultosc > 65) {
        //                         s.period.trend_ultosc = 'up'
        //                     } else if (s.period.ultosc < 50) {
        //                         s.period.trend_ultosc = 'down'
        //                     }
        //
        //                 } else if (s.options.signal == 'low') {
        //                     // use recovery indicator trigger
        //
        //                     if(s.period.ultosc > 65) {
        //                         s.period.trend_ultosc = 'up'
        //                     } else if(s.period.ultosc < 30 && signals.bottom == 0) {
        //                         s.period.trend_ultosc = 'down'
        //                     }
        //                 } else if (s.options.signal == 'trend') {
        //                     // lets got with the masses
        //
        //                     if(s.period.ultosc > 30 && signals.bottom > 0) {
        //                         s.period.trend_ultosc = 'up'
        //                     } else if(s.period.ultosc < 70 && signals.top > 0) {
        //                         s.period.trend_ultosc = 'down'
        //                     }
        //                 }
        //
        //                 signals.bottom = s.period.ultosc < 30 ? signals.bottom + 1 : 0
        //                 signals.top = s.period.ultosc > 70 ? signals.top + 1 : 0
        //
        //                 s.signales = signals
        //             }
        //
        //             if (s.period.trend_ultosc == 'up') {
        //                 if (s.trend !== 'up') {
        //                     s.acted_on_trend = false
        //                 }
        //
        //                 s.trend = 'up'
        //                 s.signal = !s.acted_on_trend ? 'buy' : null
        //             } else if (s.period.trend_ultosc == 'down') {
        //                 if (s.trend !== 'down') {
        //                     s.acted_on_trend = false
        //                 }
        //
        //                 s.trend = 'down'
        //                 s.signal = !s.acted_on_trend ? 'sell' : null
        //             }
        //
        //             cb()
        //         }).catch(function(error) {
        //             console.log(error)
        //             cb()
        //         })
        //     },
        //
        //     onReport: function (s) {
        //         let cols = []
        //
        //         if (typeof s.period.ultosc === 'number') {
        //             let signal = z(8, n(s.period.ultosc).format('0.0000'), ' ')
        //
        //             if (s.period.ultosc <= 30) {
        //                 cols.push(signal.red)
        //             } else if (s.period.ultosc > 30 && s.period.ultosc <= 50) {
        //                 cols.push(signal.yellow)
        //             } else if (s.period.ultosc > 50 && s.period.ultosc < 70) {
        //                 cols.push(signal.green)
        //             } else if (s.period.ultosc >= 70) {
        //                 cols.push(signal.bold.green)
        //             }
        //         }
        //
        //         return cols
        //     },
        //
        //     phenotypes: {
        //         period_length: Phenotypes.RangePeriod(1, 120, 'm'),
        //         min_periods: Phenotypes.Range(1, 104),
        //         markdown_buy_pct: Phenotypes.RangeFloat(-1, 5),
        //         markup_sell_pct: Phenotypes.RangeFloat(-1, 5),
        //         order_type: Phenotypes.ListOption(['maker', 'taker']),
        //         sell_stop_pct: Phenotypes.Range0(1, 50),
        //         buy_stop_pct: Phenotypes.Range0(1, 50),
        //         profit_stop_enable_pct: Phenotypes.Range0(1, 20),
        //         profit_stop_pct: Phenotypes.Range(1,20),
        //
        //         signal: Phenotypes.ListOption(['simple', 'low', 'trend']),
        //         timeperiod1: Phenotypes.Range(1,50),
        //         timeperiod2: Phenotypes.Range(1,50),
        //         timeperiod3: Phenotypes.Range(1,50),
        //         overbought_rsi_periods: Phenotypes.Range(1, 50),
        //         overbought_rsi: Phenotypes.Range(20, 100)
        //     }
        // }

        log.warn("Strategy:", s.strategy)
        ENGINE = engineFactory(s, conf)
        log.warn("ENGINE:", ENGINE)

        return conf.eventBus
    }catch(e){
        console.error(tag,"Error: ",e)
        throw e
    }
}

