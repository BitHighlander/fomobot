/*
    Simulation Module
        -Fomobot Core
            Highalnder

    Goals:
        Take over the world

 */
const TAG = " | SIM | "
var tb = require('timebucket')
const n = require('numbro')
const collectionService = require('./lib/services/collection-service')
const moment = require('moment')
const engineFactory = require('./lib/engine')
var EventEmitter = require('events')
var colors = require('colors')
let fs = require('fs')
let path = require('path')

let config = require("config")

let s =
    {
        options:
            {
                strategy: 'forex_analytics',
                disable_options: true,
                modelfile:'',
                filename: '',
                start: 1566274500000,
                end: 1566273600000,
                period: '30m',
                quarentine_time: 10,
                sell_stop_pct: 0,
                buy_stop_pct: 0,
                profit_stop_enable_pct: 0,
                profit_stop_pct: 1,
                max_slippage_pct: 5,
                buy_pct: 99,
                sell_pct: 99,
                order_adjust_time: 5000,
                max_sell_loss_pct: 99,
                max_buy_loss_pct: 99,
                order_poll_time: 5000,
                markdown_buy_pct: 0,
                markup_sell_pct: 0,
                order_type: 'maker',
                days: 10,
                currency_capital: 1000,
                asset_capital: 0,
                rsi_periods: 14,
                avg_slippage_pct: 0.045,
                stats: false,
                show_options: false,
                verbose: false,
                selector:
                    {
                        exchange_id: 'gdax',
                        product_id: 'BTC-USD',
                        asset: 'BTC',
                        currency: 'USD',
                        normalized: 'gdax.BTC-USD'
                    },
                mode: 'sim',
                period_length: '30m',
                min_periods: 100
            },
        product_id: 'BTC-USD',
        asset: 'BTC',
        currency: 'USD',
        asset_capital: 10.568005799999911,
        product:
            {
                asset: 'BTC',
                currency:
                    'USD',
                min_size:
                    '0.001',
                max_size:
                    '280',
                increment:
                    '0.01',
                asset_increment:
                    '0.00000001',
                label:
                    'BTC/USD'
            },
        balance:
            { asset: 0.000979879999999992,
                currency: '1066.40022814',
                asset_hold: 0,
                currency_hold: 0,
                deposit: 1066.40022814 },
        lookback: [],
        day_count: 1,
        my_trades: [],
        my_prev_trades: [],
        vol_since_last_blink: 0,
        last_day: 19,
        period:
            { period_id: '30m870152',
                size: '30m',
                time: 1566273600000,
                open: 10785,
                high: 10810,
                low: 10780,
                close: 10805.16,
                volume: 111.33547330999994,
                close_time: 1566275399999,
                latest_trade_time: 1566274537741,
                last_try_trade: 1566273602354 },
        in_preroll: false,
        last_period_id: undefined,
        acted_on_stop: false,
        signal: null,
        last_signal: 'sell',
        acted_on_trend: true,
        sim_asset: 0.000979879999999992,
        quote: { bid: 10785, ask: 10785 },
        start_price: 11832.95,
        start_capital: 1000,
        real_capital: 1000,
        net_currency: 1088.3602738143013,

    }


let market = "gdax.BTC-USD"

var so = {
    days: 10,
    selector: {exchange_id: market},
    start: 1566095530583,
    end: 1566273599756,
    period_length: "30m",
    strategy: "forex_analytics",
    modelfile: "",
    filename: ""
}

s.options = so
s.period = "30m"
s.my_trades = []

var conf = require('./conf')

let zenbot = {}
zenbot.conf = conf

var authStr = '', authMechanism, connectionString

if(zenbot.conf.mongo.username){
    authStr = encodeURIComponent(zenbot.conf.mongo.username)

    if(zenbot.conf.mongo.password) authStr += ':' + encodeURIComponent(zenbot.conf.mongo.password)

    authStr += '@'

    // authMechanism could be a conf.js parameter to support more mongodb authentication methods
    authMechanism = zenbot.conf.mongo.authMechanism || 'DEFAULT'
}

var connectionString = 'mongodb://' + authStr + zenbot.conf.mongo.host + ':' + zenbot.conf.mongo.port + '/' + zenbot.conf.mongo.db + '?' +
    (zenbot.conf.mongo.replicaSet ? '&replicaSet=' + zenbot.conf.mongo.replicaSet : '' ) +
    (authMechanism ? '&authMechanism=' + authMechanism : '' )


let dbClient

// let init = async function(){
//     require('mongodb').MongoClient.connect(connectionString, { useNewUrlParser: true }, function (err, client) {
//         let tag = TAG + " | AfterMongo | "
//         if (err) {
//             console.error('WARNING: MongoDB Connection Error: ', err)
//             console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
//             console.error('Attempted authentication string: ' + connectionString)
//             cb(null, zenbot)
//             return
//         }
//
//         dbClient = client
//         return client
//     })
// }
//




let simulate = function(ipcEvent){
    try{
        require('mongodb').MongoClient.connect(connectionString, { useNewUrlParser: true }, function (err, client) {
            let tag = TAG + " | AfterMongo | "
            if (err) {
                console.error('WARNING: MongoDB Connection Error: ', err)
                console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
                console.error('Attempted authentication string: ' + connectionString)
                cb(null, zenbot)
                return
            }

            //
            console.log(tag, "checkpoint")

            var db = client.db('zenbot4')
            var eventBus = new EventEmitter()
            let conf = require('./conf.js')
            conf.ipcEvent = ipcEvent
            conf.eventBus = eventBus
            conf.db = {}
            conf.db.mongo = db

            var tradesCollection = collectionService(conf).getTrades()
            var simResults = collectionService(conf).getSimResults()
            console.log(tag, "checkpoint2")

            var eventBus = conf.eventBus

            if (so.start) {
                so.start = moment(so.start, 'YYYYMMDDhhmm').valueOf()
                if (so.days && !so.end) {
                    so.end = tb(so.start).resize('1d').add(so.days).toMilliseconds()
                }
            }
            if (so.end) {
                so.end = moment(so.end, 'YYYYMMDDhhmm').valueOf()
                if (so.days && !so.start) {
                    so.start = tb(so.end).resize('1d').subtract(so.days).toMilliseconds()
                }
            }
            if (!so.start && so.days) {
                var d = tb('1d')
                so.start = d.subtract(so.days).toMilliseconds()
            }

            so.days = moment(so.end).diff(moment(so.start), 'days')

            console.log("days: ",so.days)

            // so.stats = !!cmd.enable_stats
            // so.show_options = !cmd.disable_options
            // so.verbose = !!cmd.verbose
            so.selector = market
            so.mode = 'sim'

            var engine = engineFactory(s, conf)
            if (!so.min_periods) so.min_periods = 1
            var cursor, reversing, reverse_point
            var query_start = so.start ? tb(so.start).resize(so.period_length).subtract(so.min_periods + 2).toMilliseconds() : null

            console.log(tag, "checkpoint3")

            function exitSim() {
                let tag = TAG + " | exitSim | "
                console.log(tag, "checkpoint")
                console.log(tag, "s: ",s)
                if (!s.period) {
                    console.error('no trades found! try running `zenbot backfill ' + so.selector.normalized + '` first')
                    process.exit(1)
                }
                var option_keys = Object.keys(so)
                var output_lines = []
                option_keys.sort(function (a, b) {
                    if (a < b) return -1
                    return 1
                })
                var options = {}
                option_keys.forEach(function (k) {
                    options[k] = so[k]
                })

                let options_output = options
                options_output.simresults = {}

                if (s.my_trades.length) {
                    s.my_trades.push({
                        price: s.period.close,
                        size: s.balance.asset,
                        type: 'sell',
                        time: s.period.time
                    })
                }
                s.balance.currency = n(s.net_currency).add(n(s.period.close).multiply(s.balance.asset)).format('0.00000000')

                s.balance.asset = 0
                s.lookback.unshift(s.period)
                var profit = s.start_capital ? n(s.balance.currency).subtract(s.start_capital).divide(s.start_capital) : n(0)
                output_lines.push('end balance: ' + n(s.balance.currency).format('0.00000000').yellow + ' (' + profit.format('0.00%') + ')')
                //console.log('start_capital', s.start_capital)
                //console.log('start_price', n(s.start_price).format('0.00000000'))
                //console.log('close', n(s.period.close).format('0.00000000'))
                var buy_hold = s.start_price ? n(s.period.close).multiply(n(s.start_capital).divide(s.start_price)) : n(s.balance.currency)
                //console.log('buy hold', buy_hold.format('0.00000000'))
                var buy_hold_profit = s.start_capital ? n(buy_hold).subtract(s.start_capital).divide(s.start_capital) : n(0)
                output_lines.push('buy hold: ' + buy_hold.format('0.00000000').yellow + ' (' + n(buy_hold_profit).format('0.00%') + ')')
                output_lines.push('vs. buy hold: ' + n(s.balance.currency).subtract(buy_hold).divide(buy_hold).format('0.00%').yellow)
                output_lines.push(s.my_trades.length + ' trades over ' + s.day_count + ' days (avg ' + n(s.my_trades.length / s.day_count).format('0.00') + ' trades/day)')
                var last_buy
                var losses = 0, sells = 0
                s.my_trades.forEach(function (trade) {
                    if (trade.type === 'buy') {
                        last_buy = trade.price
                    } else {
                        if (last_buy && trade.price < last_buy) {
                            losses++
                        }
                        sells++
                    }
                })
                if (s.my_trades.length) {
                    output_lines.push('win/loss: ' + (sells - losses) + '/' + losses)
                    output_lines.push('error rate: ' + (sells ? n(losses).divide(sells).format('0.00%') : '0.00%').yellow)
                }
                options_output.simresults.start_capital = s.start_capital
                options_output.simresults.last_buy_price = s.last_buy_price
                options_output.simresults.last_assest_value = s.period.close
                options_output.net_currency = s.net_currency
                options_output.simresults.asset_capital = s.asset_capital
                options_output.simresults.currency = n(s.balance.currency).value()
                options_output.simresults.profit = profit.value()
                options_output.simresults.buy_hold = buy_hold.value()
                options_output.simresults.buy_hold_profit = buy_hold_profit.value()
                options_output.simresults.total_trades = s.my_trades.length
                options_output.simresults.length_days = s.day_count
                options_output.simresults.total_sells = sells
                options_output.simresults.total_losses = losses
                options_output.simresults.vs_buy_hold = n(s.balance.currency).subtract(buy_hold).divide(buy_hold).value() * 100.00

                let options_json = JSON.stringify(options_output, null, 2)
                if (so.show_options) {
                    output_lines.push(options_json)
                }

                output_lines.forEach(function (line) {
                    console.log(line)
                })

                if (so.backtester_generation >= 0) {
                    var file_name = so.strategy.replace('_', '') + '_' + so.selector.normalized.replace('_', '').toLowerCase() + '_' + so.backtester_generation
                    fs.writeFileSync(path.resolve(__dirname, '..', 'simulations', 'sim_' + file_name + '.json'), options_json, {encoding: 'utf8'})
                    var trades_json = JSON.stringify(s.my_trades, null, 2)
                    fs.writeFileSync(path.resolve(__dirname, '..', 'simulations', 'sim_trades_' + file_name + '.json'), trades_json, {encoding: 'utf8'})
                    jsonexport(s.my_trades, function (err, csv) {
                        if (err) return console.log(err)
                        fs.writeFileSync(path.resolve(__dirname, '..', 'simulations', 'sim_trades_' + file_name + '.csv'), csv, {encoding: 'utf8'})
                    })
                }

                if (so.filename !== 'none') {
                    var html_output = output_lines.map(function (line) {
                        return colors.stripColors(line)
                    }).join('\n')
                    var data = s.lookback.slice(0, s.lookback.length - so.min_periods).map(function (period) {
                        var data = {}
                        var keys = Object.keys(period)
                        for (var i = 0; i < keys.length; i++) {
                            data[keys[i]] = period[keys[i]]
                        }
                        return data
                    })
                    var code = 'var data = ' + JSON.stringify(data) + ';\n'
                    code += 'var trades = ' + JSON.stringify(s.my_trades) + ';\n'
                    var tpl = fs.readFileSync(path.resolve(__dirname, '.', 'templates', 'sim_result.html.tpl'), {encoding: 'utf8'})
                    var out = tpl
                        .replace('{{code}}', code)
                        .replace('{{trend_ema_period}}', so.trend_ema || 36)
                        .replace('{{output}}', html_output)
                        .replace(/\{\{symbol\}\}/g, so.selector.normalized + ' - fomobot')
                    var out_target = so.filename || 'simulations/sim_result_' + so.selector.normalized + '_' + new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/-/g, '').replace(/:/g, '').replace(/20/, '') + '_UTC.html'
                    fs.writeFileSync(out_target, out)
                    console.log('wrote', out_target)
                }

                console.log("final",options_output)
                simResults.insertOne(options_output)
                    .then(() => {
                        process.exit(0)
                    })
                    .catch((err) => {
                        console.error(err)
                        process.exit(0)
                    })
            }

            function getNext() {
                let tag = TAG + " | getNext | "
                console.log(tag, "checkpoint")


                var opts = {
                    query: {
                        selector: so.selector
                    },
                    sort: {time: 1},
                    limit: 1000
                }
                if (so.end) {
                    opts.query.time = {$lte: so.end}
                }
                if (cursor) {
                    if (reversing) {
                        opts.query.time = {}
                        opts.query.time['$lt'] = cursor
                        if (query_start) {
                            opts.query.time['$gte'] = query_start
                        }
                        opts.sort = {time: -1}
                    } else {
                        if (!opts.query.time) opts.query.time = {}
                        opts.query.time['$gt'] = cursor
                    }
                } else if (query_start) {
                    if (!opts.query.time) opts.query.time = {}
                    opts.query.time['$gte'] = query_start
                }
                var collectionCursor = tradesCollection.find(opts.query).sort(opts.sort).stream()
                var numTrades = 0
                var lastTrade
                console.log(tag, "checkpoint2")

                collectionCursor.on('data', function (trade) {
                    //console.log(tag, "checkpoint3")

                    lastTrade = trade
                    numTrades++
                    if (so.symmetrical && reversing) {
                        trade.orig_time = trade.time
                        trade.time = reverse_point + (reverse_point - trade.time)
                    }
                    eventBus.emit('trade', trade)
                    //console.log(tag, "trade: ", trade)

                })

                collectionCursor.on('end', function () {
                    if (numTrades === 0) {
                        if (so.symmetrical && !reversing) {
                            reversing = true
                            reverse_point = cursor
                            return getNext()
                        }
                        engine.exit(exitSim)
                        //exitSim()
                        //return
                    } else {
                        if (reversing) {
                            cursor = lastTrade.orig_time
                        } else {
                            cursor = lastTrade.time
                        }
                    }
                    setImmediate(getNext)
                })
            }

            getNext()


        })
    }catch(e){
        console.error(e)
    }
}


//console.log(tag,'Generating training candlesticks from database...')
//getTrades()

export default {
//    init,
    simulate
}
//module.exports = ({train})
