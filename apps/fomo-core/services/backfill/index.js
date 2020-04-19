const TAG = " | CORE-backfill | "


var tb = require('timebucket')
    , crypto = require('crypto')
    , objectifySelector = require('../../lib/objectify-selector')
    , collectionService = require('../../lib/services/collection-service')

var moment = require('moment');

let log = require("default-logger")()

var conf = require('../../conf')

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


let backfill = async function(days,ipcEvent){
    let tag = TAG + " | Backfill | "
    try{
        if(!days) throw Error("days required! ",days)


        //TODO migrate to monk like a civilized person
        require('mongodb').MongoClient.connect(connectionString, { useNewUrlParser: true }, function (err, client) {
            if (err) {
                console.error('WARNING: MongoDB Connection Error: ', err)
                console.error('WARNING: without MongoDB some features (such as backfilling/simulation) may be disabled.')
                console.error('Attempted authentication string: ' + connectionString)
                cb(null, zenbot)
                return
            }



            var db = client.db('zenbot4')

            var EventEmitter = require('events')
            var eventBus = new EventEmitter()
            var conf = require('../../conf')
            let zenbot = {}
            zenbot.conf = conf
            conf.eventBus = eventBus
            conf.db = {}
            conf.db.mongo = db
            log.debug(conf.db)

            let cmd = {}

            cmd.days = 1

            selector = objectifySelector(conf.selector)
            log.info("selector: ",selector)


            //var exchange = require(`../../extensions/exchanges/${selector.exchange_id}/exchange`)(conf)
            var exchange = require(`../../extensions/exchanges/bitmex/exchange`)(conf)

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
                // if (mode === 'backward') {
                //     opts.to = marker.from
                // } else {
                //     if (marker.to) opts.from = marker.to + 1
                //     else opts.from = exchange.getCursor(start_time)
                // }
                // if (offset) {
                //     opts.offset = offset
                // }

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
                    log.info("trades: ",trades)
                    if(trades[0])last_batch_id = trades[0].trade_id
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
        })

    }catch(e){
        console.error(e)
    }
}


//console.log(tag,'Generating training candlesticks from database...')
//getTrades()

// export default {
// //    init,
//     backfill: index
// }

module.exports = ({backfill})
