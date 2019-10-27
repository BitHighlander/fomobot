/*


 */

/*

        Trade bot from scratch


        got oldest in mongo

        get newest

        verify up to date with now

        else backfill



        begin, load ALL data into engine

        poll new trades every minute

        get signal from forex

        buy

        sell

 */
let TAG = " | Trade Engine g2 | "
let log = require("loggerdog-client")()

let engineFactory = require('../modules/lib/engine')
var EventEmitter = require('events')
const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')
const moment = require('moment');
let path = require('path')

let run_bot = async function(modelPath){
    let tag = TAG+" | run_bot | "
    try{

        //get status
        let dataStatus = await getBackfillStatus()
        log.info(tag,"dataStatus:",dataStatus)

        //get time now

        //build work

        //add to queue

        //wait for work to be done

        //init engine
        var eventBus = new EventEmitter()
        var conf = require('../modules/conf')
        conf.eventBus = eventBus
        conf.db = {}
        conf.db.mongo = db

        var s = {
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
                period_length: "30m",
                strategy: 'forex_analytics',
                modelfile:modelPath
            },
        }
        s.strategy = require(path.resolve(__dirname, `../modules/extensions/strategies/${s.options.strategy}/strategy`))

        var engine = engineFactory(s, conf)

        //get all trades
        let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"},{limit:1000})
        log.info(tag,"total trades: ",allTrades.length)

        //load engine
        engine.update(allTrades,true,function(err){
            if(err) throw Error(error)
        })

        engine.on
        //every minute get more trades


    }catch(e){
        log.error(e)
    }
}
















let getBackfillStatus = async function () {
    let tag = TAG+" | getBackfillStatus | "
    try{
        let output = {}
        let count = await tradesDB.count()
        output.count = count

        //get oldest
        let oldest = await tradesDB.findOne({selector:"bitmex.BTC-USD"},{limit:1,sort:{time:1}})
        log.info(tag,"oldest: ",oldest)
        output.oldest = moment(oldest.time).calendar()

        //get newest
        let newest = await tradesDB.findOne({selector:"bitmex.BTC-USD"},{limit:1,sort:{time:-1}})
        output.newest = moment(newest.time).calendar()

        return output
    }catch(e){
        console.error("e: ",e)
    }
}



let modelPath =  "/home/highlander/WebstormProjects/fomo-core/services/trade/models/temp.06386bd67dd782a007ba18193c5bfa4f4e6fd42a57849b3db7b5ba911f1eb9db-20190927_040010+0000.json"

run_bot(modelPath)

