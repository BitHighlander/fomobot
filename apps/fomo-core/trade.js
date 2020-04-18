const TAG = " | Live Trading | "

var EventEmitter = require('events')
var tb = require('timebucket')
    , minimist = require('minimist')
    , n = require('numbro')
    , fs = require('fs')
    , path = require('path')
    , spawn = require('child_process').spawn
    , moment = require('moment')
    , crypto = require('crypto')
    , readline = require('readline')
    , colors = require('colors')
    , z = require('zero-fill')
    , cliff = require('cliff')
    , output = require('./lib/output')
    , objectifySelector = require('./lib/objectify-selector')
    , engineFactory = require('./lib/engine')
    , collectionService = require('./lib/services/collection-service')
    , debug = require('./lib/debug')

var conf = require('./conf')

let zenbot = {}
zenbot.conf = conf

var authStr = '', authMechanism, connectionString

if (zenbot.conf.mongo.username) {
    authStr = encodeURIComponent(zenbot.conf.mongo.username)

    if (zenbot.conf.mongo.password) authStr += ':' + encodeURIComponent(zenbot.conf.mongo.password)

    authStr += '@'

    // authMechanism could be a conf.js parameter to support more mongodb authentication methods
    authMechanism = zenbot.conf.mongo.authMechanism || 'DEFAULT'
}

var connectionString = 'mongodb://' + authStr + zenbot.conf.mongo.host + ':' + zenbot.conf.mongo.port + '/' + zenbot.conf.mongo.db + '?' +
    (zenbot.conf.mongo.replicaSet ? '&replicaSet=' + zenbot.conf.mongo.replicaSet : '') +
    (authMechanism ? '&authMechanism=' + authMechanism : '')


require('mongodb').MongoClient.connect(connectionString, {useNewUrlParser: true}, function (err, client) {
    let tag = TAG + " | afterMongo | "
    if (err) {
        console.error('WARNING: MongoDB Connection Error: ', err)
        console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
        console.error('Attempted authentication string: ' + connectionString)
        cb(null, zenbot)
        return
    }

    var conf = require('./conf')
    console.log("conf: ",conf.selector)

    var db = client.db('zenbot4')
    var eventBus = new EventEmitter()
    conf.eventBus = eventBus
    conf.db = {}
    conf.db.mongo = db


    var raw_opts = {}
    //raw_opts.currency_capital


    //var raw_opts = minimist(process.argv)

    // var raw_opts = { _:
    //     [ '/home/highlander/.nvm/versions/node/v10.16.0/bin/node',
    //         '/home/highlander/WebstormProjects/zenbot/zenbot.js',
    //         'trade' ],
    //         paper: true }


    //var s = {options: JSON.parse(JSON.stringify(raw_opts))}

    var s = {
        selector:
            { exchange_id: 'bitmex',
                product_id: 'BTC-USD',
                asset: 'BTC',
                currency: 'USD',
                normalized: 'bitmex.BTC-USD' },
        options:{
            paper:true,
            period_length:"30m",
            strategy:'forex_analytics'
        },
    }
    //
    var so = s.options


    if (so.strategy) {
        console.log("********* so.strategy: ",so.strategy)
        s.strategy = require(path.resolve(__dirname, `./extensions/strategies/${so.strategy}/strategy`))
        if (s.strategy.getOptions) {
            s.strategy.getOptions.call(s.ctx, s)
        }
        if (s.strategy.orderExecuted) {
            eventBus.on('orderExecuted', function(type) {
                s.strategy.orderExecuted(s, type, executeSignal)
            })
        }
    }

    console.log("(checkpoint2) so: ",so)

    if (so.run_for) {
        var botStartTime = moment().add(so.run_for, 'm')
    }
    if (!so.interval_trade) {
        so.interval_trade = 10
    }
    if (!so.quarentine_time) {
        so.quarentine_time = 10
    }
    delete so._
    let cmd = {}
    //cmd.conf = conf

    console.log("(checkpoint3) so: ",so)

    if (cmd.conf) {
        var overrides = require(path.resolve(process.cwd(), cmd.conf))
        Object.keys(overrides).forEach(function (k) {
            so[k] = overrides[k]
        })
    }
    Object.keys(conf).forEach(function (k) {
        if (typeof cmd[k] !== 'undefined') {
            so[k] = cmd[k]
        }
    })

    console.log("(checkpoint4) so: ",so)

    so.currency_increment = cmd.currency_increment
    so.keep_lookback_periods = cmd.keep_lookback_periods
    so.use_prev_trades = (cmd.use_prev_trades||conf.use_prev_trades)
    so.min_prev_trades = cmd.min_prev_trades
    so.debug = cmd.debug
    so.stats = !cmd.disable_stats
    so.mode = so.paper ? 'paper' : 'live'
    if (so.buy_max_amt) {
        console.log(('--buy_max_amt is deprecated, use --deposit instead!\n').red)
        so.deposit = so.buy_max_amt
    }
    so.selector = objectifySelector(conf.selector)

    var engine = engineFactory(s, conf)
    var collectionServiceInstance = collectionService(conf)
    if (!so.min_periods) so.min_periods = 1

    var exchange = require(`apps/fomo-core`)(conf)

    console.log("(checkpoint5) so: ",so)

    // const keyMap = new Map()
    // keyMap.set('b', 'limit'.grey + ' BUY'.green)
    // keyMap.set('B', 'market'.grey + ' BUY'.green)
    // keyMap.set('s', 'limit'.grey + ' SELL'.red)
    // keyMap.set('S', 'market'.grey + ' SELL'.red)
    // keyMap.set('c', 'cancel order'.grey)
    // keyMap.set('m', 'toggle MANUAL trade in LIVE mode ON / OFF'.grey)
    // keyMap.set('T', 'switch to \'Taker\' order type'.grey)
    // keyMap.set('M', 'switch to \'Maker\' order type'.grey)
    // keyMap.set('o', 'show current trade options'.grey)
    // keyMap.set('O', 'show current trade options in a dirty view (full list)'.grey)
    // keyMap.set('L', 'toggle DEBUG'.grey)
    // keyMap.set('P', 'print statistical output'.grey)
    // keyMap.set('X', 'exit program with statistical output'.grey)
    // keyMap.set('d', 'dump statistical output to HTML file'.grey)
    // keyMap.set('D', 'toggle automatic HTML dump to file'.grey)
    //
    // function listKeys() {
    //     console.log('\nAvailable command keys:')
    //     keyMap.forEach((value, key) => {
    //         console.log(' ' + key + ' - ' + value)
    //     })
    // }
    //
    // function listOptions () {
    //     console.log()
    //     console.log(s.exchange.name.toUpperCase() + ' exchange active trading options:'.grey)
    //     console.log()
    //     process.stdout.write(z(22, 'STRATEGY'.grey, ' ') + '\t' + so.strategy + '\t' + (require(`../extensions/strategies/${so.strategy}/strategy`).description).grey)
    //     console.log('\n')
    //     process.stdout.write([
    //         z(24, (so.mode === 'paper' ? so.mode.toUpperCase() : so.mode.toUpperCase()) + ' MODE'.grey, ' '),
    //         z(26, 'PERIOD'.grey, ' '),
    //         z(30, 'ORDER TYPE'.grey, ' '),
    //         z(28, 'SLIPPAGE'.grey, ' '),
    //         z(33, 'EXCHANGE FEES'.grey, ' ')
    //     ].join('') + '\n')
    //     process.stdout.write([
    //         z(15, (so.mode === 'paper' ? '      ' : (so.mode === 'live' && (so.manual === false || typeof so.manual === 'undefined')) ? '       ' + 'AUTO'.black.bgRed + '    ' : '       ' + 'MANUAL'.black.bgGreen + '  '), ' '),
    //         z(13, so.period_length, ' '),
    //         z(29, (so.order_type === 'maker' ? so.order_type.toUpperCase().green : so.order_type.toUpperCase().red), ' '),
    //         z(31, (so.mode === 'paper' ? 'avg. '.grey + so.avg_slippage_pct + '%' : 'max '.grey + so.max_slippage_pct + '%'), ' '),
    //         z(20, (so.order_type === 'maker' ? so.order_type + ' ' + s.exchange.makerFee : so.order_type + ' ' + s.exchange.takerFee), ' ')
    //     ].join('') + '\n')
    //     process.stdout.write('')
    //     process.stdout.write([
    //         z(19, 'BUY %'.grey, ' '),
    //         z(20, 'SELL %'.grey, ' '),
    //         z(35, 'TRAILING STOP %'.grey, ' '),
    //         z(33, 'TRAILING DISTANCE %'.grey, ' ')
    //     ].join('') + '\n')
    //     process.stdout.write([
    //         z(9, so.buy_pct + '%', ' '),
    //         z(9, so.sell_pct + '%', ' '),
    //         z(20, so.profit_stop_enable_pct + '%', ' '),
    //         z(20, so.profit_stop_pct + '%', ' ')
    //     ].join('') + '\n')
    //     process.stdout.write('')
    // }
    // listOptions()

    /* Implementing statistical Exit */
    function printTrade (quit, dump, statsonly = false) {
        var tmp_balance = n(s.net_currency).add(n(s.period.close).multiply(s.balance.asset)).format('0.00000000')
        if (quit) {
            if (s.my_trades.length) {
                s.my_trades.push({
                    price: s.period.close,
                    size: s.balance.asset,
                    type: 'sell',
                    time: s.period.time
                })
            }
            s.balance.currency = tmp_balance
            s.balance.asset = 0
            s.lookback.unshift(s.period)
        }
        var profit = s.start_capital ? n(tmp_balance).subtract(s.start_capital).divide(s.start_capital) : n(0)
        var buy_hold = s.start_price ? n(s.period.close).multiply(n(s.start_capital).divide(s.start_price)) : n(tmp_balance)
        var buy_hold_profit = s.start_capital ? n(buy_hold).subtract(s.start_capital).divide(s.start_capital) : n(0)
        if (!statsonly) {
            console.log()
            var output_lines = []
            output_lines.push('last balance: ' + n(tmp_balance).format('0.00000000').yellow + ' (' + profit.format('0.00%') + ')')
            output_lines.push('buy hold: ' + buy_hold.format('0.00000000').yellow + ' (' + n(buy_hold_profit).format('0.00%') + ')')
            output_lines.push('vs. buy hold: ' + n(tmp_balance).subtract(buy_hold).divide(buy_hold).format('0.00%').yellow)
            output_lines.push(s.my_trades.length + ' trades over ' + s.day_count + ' days (avg ' + n(s.my_trades.length / s.day_count).format('0.00') + ' trades/day)')
        }
        // Build stats for UI
        s.stats = {
            profit: profit.format('0.00%'),
            tmp_balance: n(tmp_balance).format('0.00000000'),
            buy_hold: buy_hold.format('0.00000000'),
            buy_hold_profit: n(buy_hold_profit).format('0.00%'),
            day_count: s.day_count,
            trade_per_day: n(s.my_trades.length / s.day_count).format('0.00')
        }

        var last_buy
        var losses = 0, sells = 0
        s.my_trades.forEach(function (trade) {
            if (trade.type === 'buy') {
                last_buy = trade.price
            }
            else {
                if (last_buy && trade.price < last_buy) {
                    losses++
                }
                sells++
            }
        })
        if (s.my_trades.length && sells > 0) {
            if (!statsonly) {
                output_lines.push('win/loss: ' + (sells - losses) + '/' + losses)
                output_lines.push('error rate: ' + (sells ? n(losses).divide(sells).format('0.00%') : '0.00%').yellow)
            }

            //for API
            s.stats.win = (sells - losses)
            s.stats.losses = losses
            s.stats.error_rate = (sells ? n(losses).divide(sells).format('0.00%') : '0.00%')
        }
        if (!statsonly) {
            output_lines.forEach(function (line) {
                console.log(line)
            })
        }
        if (quit || dump) {
            var html_output = output_lines.map(function (line) {
                return colors.stripColors(line)
            }).join('\n')
            var data = s.lookback.slice(0, s.lookback.length - so.min_periods).map(function (period) {
                var data = {}
                var keys = Object.keys(period)
                for(var i = 0; i < keys.length; i++){
                    data[keys[i]] = period[keys[i]]
                }
                return data
            })
            var code = 'var data = ' + JSON.stringify(data) + ';\n'
            code += 'var trades = ' + JSON.stringify(s.my_trades) + ';\n'
            var tpl = fs.readFileSync(path.resolve(__dirname, '..', 'templates', 'sim_result.html.tpl'), {encoding: 'utf8'})
            var out = tpl
                .replace('{{code}}', code)
                .replace('{{trend_ema_period}}', so.trend_ema || 36)
                .replace('{{output}}', html_output)
                .replace(/\{\{symbol\}\}/g,  so.selector.normalized + ' - zenbot ' + require('../package.json').version)
            if (so.filename !== 'none') {
                var out_target
                var out_target_prefix = so.paper ? 'simulations/paper_result_' : 'stats/trade_result_'
                if(dump){
                    var dt = new Date().toISOString()

                    //ymd
                    var today = dt.slice(2, 4) + dt.slice(5, 7) + dt.slice(8, 10)
                    out_target = so.filename || out_target_prefix + so.selector.normalized +'_' + today + '_UTC.html'
                    fs.writeFileSync(out_target, out)
                }else
                    out_target = so.filename || out_target_prefix + so.selector.normalized +'_' + new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/-/g, '').replace(/:/g, '').replace(/20/, '') + '_UTC.html'

                fs.writeFileSync(out_target, out)
                console.log('\nwrote'.grey, out_target)
            }
            if(quit) process.exit(0)
        }
    }
    /* The end of printTrade */

    /* Implementing statistical status dump every 10 secs */
    var shouldSaveStats = false
    function toggleStats(){
        shouldSaveStats = !shouldSaveStats
        if(shouldSaveStats)
            console.log('Auto stats dump enabled')
        else
            console.log('Auto stats dump disabled')
    }

    function saveStatsLoop(){
        saveStats()
        setTimeout(function () {
            saveStatsLoop()
        }, 10000)
    }
    saveStatsLoop()

    function saveStats () {
        if(!shouldSaveStats) return

        var output_lines = []
        var tmp_balance = n(s.net_currency).add(n(s.period.close).multiply(s.balance.asset)).format('0.00000000')

        var profit = s.start_capital ? n(tmp_balance).subtract(s.start_capital).divide(s.start_capital) : n(0)
        output_lines.push('last balance: ' + n(tmp_balance).format('0.00000000').yellow + ' (' + profit.format('0.00%') + ')')
        var buy_hold = s.start_price ? n(s.period.close).multiply(n(s.start_capital).divide(s.start_price)) : n(tmp_balance)
        var buy_hold_profit = s.start_capital ? n(buy_hold).subtract(s.start_capital).divide(s.start_capital) : n(0)
        output_lines.push('buy hold: ' + buy_hold.format('0.00000000').yellow + ' (' + n(buy_hold_profit).format('0.00%') + ')')
        output_lines.push('vs. buy hold: ' + n(tmp_balance).subtract(buy_hold).divide(buy_hold).format('0.00%').yellow)
        output_lines.push(s.my_trades.length + ' trades over ' + s.day_count + ' days (avg ' + n(s.my_trades.length / s.day_count).format('0.00') + ' trades/day)')
        // Build stats for UI
        s.stats = {
            profit: profit.format('0.00%'),
            tmp_balance: n(tmp_balance).format('0.00000000'),
            buy_hold: buy_hold.format('0.00000000'),
            buy_hold_profit: n(buy_hold_profit).format('0.00%'),
            day_count: s.day_count,
            trade_per_day: n(s.my_trades.length / s.day_count).format('0.00')
        }

        var last_buy
        var losses = 0, sells = 0
        s.my_trades.forEach(function (trade) {
            if (trade.type === 'buy') {
                last_buy = trade.price
            }
            else {
                if (last_buy && trade.price < last_buy) {
                    losses++
                }
                sells++
            }
        })
        if (s.my_trades.length && sells > 0) {
            output_lines.push('win/loss: ' + (sells - losses) + '/' + losses)
            output_lines.push('error rate: ' + (sells ? n(losses).divide(sells).format('0.00%') : '0.00%').yellow)

            //for API
            s.stats.win = (sells - losses)
            s.stats.losses = losses
            s.stats.error_rate = (sells ? n(losses).divide(sells).format('0.00%') : '0.00%')
        }

        var html_output = output_lines.map(function (line) {
            return colors.stripColors(line)
        }).join('\n')
        var data = s.lookback.slice(0, s.lookback.length - so.min_periods).map(function (period) {
            var data = {}
            var keys = Object.keys(period)
            for(var i = 0; i < keys.length; i++){
                data[keys[i]] = period[keys[i]]
            }
            return data
        })
        var code = 'var data = ' + JSON.stringify(data) + ';\n'
        code += 'var trades = ' + JSON.stringify(s.my_trades) + ';\n'
        var tpl = fs.readFileSync(path.resolve(__dirname, '..', 'templates', 'sim_result.html.tpl'), {encoding: 'utf8'})
        var out = tpl
            .replace('{{code}}', code)
            .replace('{{trend_ema_period}}', so.trend_ema || 36)
            .replace('{{output}}', html_output)
            .replace(/\{\{symbol\}\}/g,  so.selector.normalized + ' - zenbot ' + require('../package.json').version)
        if (so.filename !== 'none') {
            var out_target
            var dt = new Date().toISOString()

            //ymd
            var today = dt.slice(2, 4) + dt.slice(5, 7) + dt.slice(8, 10)
            let out_target_prefix = so.paper ? 'simulations/paper_result_' : 'stats/trade_result_'
            out_target = so.filename || out_target_prefix + so.selector.normalized +'_' + today + '_UTC.html'

            fs.writeFileSync(out_target, out)
            //console.log('\nwrote'.grey, out_target)
        }

    }

    var order_types = ['maker', 'taker']
    if (!order_types.includes(so.order_type)) {
        so.order_type = 'maker'
    }

    var db_cursor, trade_cursor
    var query_start = tb().resize(so.period_length).subtract(so.min_periods * 2).toMilliseconds()
    var days = Math.ceil((new Date().getTime() - query_start) / 86400000)
    var session = null
    var sessions = collectionServiceInstance.getSessions()
    var balances = collectionServiceInstance.getBalances()
    var trades = collectionServiceInstance.getTrades()
    var resume_markers = collectionServiceInstance.getResumeMarkers()
    var marker = {
        id: crypto.randomBytes(4).toString('hex'),
        selector: so.selector.normalized,
        from: null,
        to: null,
        oldest_time: null
    }
    marker._id = marker.id
    var lookback_size = 0
    var my_trades_size = 0
    var my_trades = collectionServiceInstance.getMyTrades()
    var periods = collectionServiceInstance.getPeriods()

    console.log('fetching pre-roll data:')
    //var zenbot_cmd = process.platform === 'win32' ? 'zenbot.bat' : 'zenbot.sh' // Use 'win32' for 64 bit windows too
    var command_args = ['backfill', so.selector.normalized, '--days', days || 1]
    if (cmd.conf) {
        command_args.push('--conf', cmd.conf)
    }

    /*
        Assumes backfill is complete???

        deleted backfill process.exe
     */


    function getNext () {
        var opts = {
            query: {
                selector: so.selector.normalized
            },
            sort: {time: 1},
            limit: 1000
        }
        if (db_cursor) {
            opts.query.time = {$gt: db_cursor}
        }
        else {
            trade_cursor = s.exchange.getCursor(query_start)
            opts.query.time = {$gte: query_start}
        }
        console.log("opts.query: ",opts.query)
        trades.find(opts.query).limit(opts.limit).sort(opts.sort).toArray(function (err, trades) {
            if (err) throw err
            console.log("trades: ",trades.length)

            if (trades.length && so.use_prev_trades) {
                let prevOpts = {
                    query: {
                        selector: so.selector.normalized
                    },
                    limit: so.min_prev_trades
                }
                if (!so.min_prev_trades) {
                    prevOpts.query.time = {$gte : trades[0].time}
                }
                my_trades.find(prevOpts.query).sort({$natural:-1}).limit(prevOpts.limit).toArray(function (err, my_prev_trades) {
                    if (err) throw err
                    if (my_prev_trades.length) {
                        s.my_prev_trades = my_prev_trades.reverse().slice(0) // simple copy, less recent executed first
                    }
                })
            }
            if (!trades.length) {
                var head = '------------------------------------------ INITIALIZE  OUTPUT ------------------------------------------'
                console.log(head)

                output(conf).initializeOutput(s)
                var minuses = Math.floor((head.length - so.mode.length - 19) / 2)
                console.log('-'.repeat(minuses) + ' STARTING ' + so.mode.toUpperCase() + ' TRADING ' + '-'.repeat(minuses + (minuses % 2 == 0 ? 0 : 1)))
                if (so.mode === 'paper') {
                    console.log('!!! Paper mode enabled. No real trades are performed until you remove --paper from the startup command.')
                }

                console.log('Press ' + ' l '.inverse + ' to list available commands.')

                engine.syncBalance(function (err) {
                    if (err) {
                        if (err.desc) console.error(err.desc)
                        if (err.body) console.error(err.body)
                        throw err
                    }
                    session = {
                        id: crypto.randomBytes(4).toString('hex'),
                        selector: so.selector.normalized,
                        started: new Date().getTime(),
                        mode: so.mode,
                        options: so
                    }
                    session._id = session.id
                    sessions.find({selector: so.selector.normalized}).limit(1).sort({started: -1}).toArray(function (err, prev_sessions) {
                        if (err) throw err
                        var prev_session = prev_sessions[0]
                        if (prev_session && !cmd.reset_profit) {
                            if (prev_session.orig_capital && prev_session.orig_price && prev_session.deposit === so.deposit && ((so.mode === 'paper' && !raw_opts.currency_capital && !raw_opts.asset_capital) || (so.mode === 'live' && prev_session.balance.asset == s.balance.asset && prev_session.balance.currency == s.balance.currency))) {
                                s.orig_capital = session.orig_capital = prev_session.orig_capital
                                s.orig_price = session.orig_price = prev_session.orig_price
                                if (so.mode === 'paper') {
                                    s.balance = prev_session.balance
                                }
                            }
                        }
                        if(s.lookback.length > so.keep_lookback_periods){
                            s.lookback.splice(-1,1)
                        }

                        forwardScan()
                        setInterval(forwardScan, so.poll_trades)

                    })
                })
                return
            }
            db_cursor = trades[trades.length - 1].time
            trade_cursor = s.exchange.getCursor(trades[trades.length - 1])
            engine.update(trades, true, function (err) {
                if (err) throw err
                setImmediate(getNext)
            })
        })
    }
    engine.writeHeader()
    getNext()


    forwardScan()

    session = {
        id: crypto.randomBytes(4).toString('hex'),
        selector: so.selector.normalized,
        started: new Date().getTime(),
        mode: so.mode,
        options: so
    }
    // engine.executeSignal('buy', null, null, false, true)
    var prev_timeout = null
    function forwardScan () {
        function saveSession () {
            engine.syncBalance(function (err) {

                //engine.executeSignal('buy', null, null, false, true)

                s.balance =
                    { asset: 0.000979879999999992,
                        currency: '1066.40022814',
                        asset_hold: 0,
                        currency_hold: 0,
                        deposit: 1066.40022814 }

                if (!err && s.balance.asset === undefined) {
                    // TODO not the nicest place to verify the state, but did not found a better one
                    throw new Error('Error during syncing balance. Please check your API-Key')
                }
                if (err) {
                    console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error syncing balance')
                    if (err.desc) console.error(err.desc)
                    if (err.body) console.error(err.body)
                    console.error(err)
                }
                if (botStartTime && botStartTime - moment() < 0 ) {
                    // Not sure if I should just handle exit code directly or thru printTrade.  Decided on printTrade being if code is added there for clean exits this can just take advantage of it.
                    engine.exit(() => {
                        printTrade(true)
                    })
                }
                session.updated = new Date().getTime()
                session.balance = s.balance
                session.start_capital = s.start_capital
                session.start_price = s.start_price
                session.num_trades = s.my_trades.length
                if (so.deposit) session.deposit = so.deposit
                if (!session.orig_capital) session.orig_capital = s.start_capital
                if (!session.orig_price) session.orig_price = s.start_price
                if (s.period) {
                    session.price = s.period.close
                    var d = tb().resize(conf.balance_snapshot_period)
                    var b = {
                        id: so.selector.normalized + '-' + d.toString(),
                        selector: so.selector.normalized,
                        time: d.toMilliseconds(),
                        currency: s.balance.currency,
                        asset: s.balance.asset,
                        price: s.period.close,
                        start_capital: session.orig_capital,
                        start_price: session.orig_price,
                    }
                    b._id = b.id
                    b.consolidated = n(s.balance.asset).multiply(s.period.close).add(s.balance.currency).value()
                    b.profit = (b.consolidated - session.orig_capital) / session.orig_capital
                    b.buy_hold = s.period.close * (session.orig_capital / session.orig_price)
                    b.buy_hold_profit = (b.buy_hold - session.orig_capital) / session.orig_capital
                    b.vs_buy_hold = (b.consolidated - b.buy_hold) / b.buy_hold
                    conf.output.api.on && printTrade(false, false, true)
                    if (so.mode === 'live') {
                        balances.save(b, function (err) {
                            if (err) {
                                console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving balance')
                                console.error(err)
                            }
                        })
                    }
                    session.balance = b
                }
                else {
                    session.balance = {
                        currency: s.balance.currency,
                        asset: s.balance.asset
                    }
                }
                sessions.save(session, function (err) {
                    if (err) {
                        console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving session')
                        console.error(err)
                    }
                    if (s.period) {
                        engine.writeReport(true)
                    } else {
                        readline.clearLine(process.stdout)
                        readline.cursorTo(process.stdout, 0)
                        process.stdout.write('Waiting on first live trade to display reports, could be a few minutes ...')
                    }
                })
            })
        }

        var opts = {product_id: 'BTC-USD'}
        //console.log("marker: ",marker)

        if(!marker.to){
            marker.to = moment(new Date()).toISOString();
            opts.to = marker.to
        }


        if(!marker.from){
            let tenMinAgo = moment(new Date()).subtract(104, 'h')
            marker.from =  moment(new Date(tenMinAgo)).toISOString()
            opts.from = marker.from
        }


        if(marker.newest_time){
            // log.debug("move time back!")
            opts.to = moment(new Date()).toISOString();
            opts.from = moment(new Date(marker.newest_time)).subtract(1, 'h').toISOString()
        } else {
            opts.to = moment(new Date(marker.to)).toISOString();
            opts.from = moment(new Date(marker.from)).toISOString();
        }

        //console.log("trade_cursor: ",trade_cursor)
        //
        console.log("opts: ",opts)

        //console.log("opts: EXCHANGE: ",s.exchange)


        exchange.getTrades(opts, function (err, trades) {
            if (err) {

                if (err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND' || err.code === 'ECONNRESET') {
                    if (prev_timeout) {
                        console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - getTrades request timed out. retrying...')
                    }
                    prev_timeout = true
                }
                else if (err.code === 'HTTP_STATUS') {
                    if (prev_timeout) {
                        console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - getTrades request failed: ' + err.message + '. retrying...')
                    }
                    prev_timeout = true
                }
                else {
                    console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - getTrades request failed. retrying...')
                    console.error(err)
                }
                return
            }
            console.log("trades: ",trades.length)
            prev_timeout = null
            if (trades.length) {
                trades.sort(function (a, b) {
                    if (a.time > b.time) return -1
                    if (a.time < b.time) return 1
                    return 0
                })
                trades.forEach(function (trade) {
                    var this_cursor = s.exchange.getCursor(trade)
                    trade_cursor = Math.max(this_cursor, trade_cursor)
                    saveTrade(trade)
                })
                engine.update(trades, function (err) {
                    if (err) {
                        console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving session')
                        console.error(err)
                    }
                    resume_markers.save(marker, function (err) {
                        if (err) {
                            console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving marker')
                            console.error(err)
                        }
                    })
                    if (s.my_trades.length > my_trades_size) {
                        s.my_trades.slice(my_trades_size).forEach(function (my_trade) {
                            my_trade.id = crypto.randomBytes(4).toString('hex')
                            my_trade._id = my_trade.id
                            my_trade.selector = so.selector.normalized
                            my_trade.session_id = session.id
                            my_trade.mode = so.mode
                            my_trades.save(my_trade, function (err) {
                                if (err) {
                                    console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving my_trade')
                                    console.error(err)
                                }
                            })
                        })
                        my_trades_size = s.my_trades.length
                    }
                    function savePeriod (period) {
                        if (!period.id) {
                            period.id = crypto.randomBytes(4).toString('hex')
                            period.selector = so.selector.normalized
                            period.session_id = session.id
                        }
                        period._id = period.id
                        periods.save(period, function (err) {
                            if (err) {
                                console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving my_trade')
                                console.error(err)
                            }
                        })
                    }
                    if (s.lookback.length > lookback_size) {
                        savePeriod(s.lookback[0])
                        lookback_size = s.lookback.length
                    }
                    if (s.period) {
                        savePeriod(s.period)
                    }
                    saveSession()
                })
            } else {
                console.log("CHECKPOINT! SAVE SESSION! ")
                saveSession()
            }
        })
        function saveTrade (trade) {
            //console.log("trade: ",trade)


            trade.id = so.selector.normalized + '-' + String(trade.trade_id)
            trade.selector = so.selector.normalized
            // if (!marker.from) {
            //     marker.from = trade_cursor
            //     marker.oldest_time = trade.time
            //     marker.newest_time = trade.time
            // }
            // marker.to = marker.to ? Math.max(marker.to, trade_cursor) : trade_cursor
            if(!marker.newest_time) marker.newest_time = new Date().getTime()/1000
            marker.newest_time = Math.max(marker.newest_time, trade.time)

            //console.log("marker.newest_time: ",marker.newest_time)

            trades.save(trade, function (err) {
                // ignore duplicate key errors
                if (err && err.code !== 11000) {
                    console.error('\n' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - error saving trade')
                    console.error(err)
                }
            })
        }
    }

})
