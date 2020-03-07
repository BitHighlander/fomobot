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
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
let TAG = " | Trade Engine g2 | "
let log = require("default-logger")()
const BitMEXClient = require('bitmex-realtime-api');

let engineFactory = require('../../lib/engine')
var EventEmitter = require('events')
const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')
const moment = require('moment');
let path = require('path')

const client = new BitMEXClient();

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
        var conf = require('../../conf')
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
                min_periods:100,
                period_length: "1m",
                modelfile:modelPath
            },
        }

        //s.options.strategy =  'forex_analytics' //(why the fuck It saying buy and sell at same time!?!?
        //s.options.strategy =  'bollinger'
        //s.options.strategy =  'cci_srsi'
        //s.options.strategy =  'crossover_vwap'
        //s.options.strategy =  'dema'
        //s.options.strategy =  'ichimoku_score'
        //s.options.strategy =  'ichimoku'
        //s.options.strategy =  'speed'

        //s.options.strategy =  'wavetrend'
        //s.options.strategy =  'trust_distrust'
        s.options.strategy =  'ta_ultosc' //very active!
        //s.options.strategy =  'stddev'

        //broke
        //s.options.strategy =  'trendline' //????
        //s.options.strategy =  'renko' //BROKE

        s.strategy = require(path.resolve(__dirname, `../../extensions/strategies/${s.options.strategy}/strategy`))

        var engine = engineFactory(s, conf)
        //
        // //get all trades
        let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"},{limit:10000,sort:{time:-1}})
        log.info(tag,"total trades: ",allTrades.length)
        //log.info(tag,"total trades: ",allTrades)

        //load engine
        engine.update(allTrades,true,function(err){
            if(err) throw Error(error)
        })

        console.log("engine!: *********: ",engine)

        //sub to trades
        client.addStream('XBTUSD', 'trade', function (data, symbol, tableName) {
            // Do something with the table data...
            //console.log(data, symbol, tableName)


            //console.log("data: ",data)
            //console.log("tableName: ",tableName)
            //console.log("data: ",data.length)

            let clean = []
            for(let i = 0; i < data.length; i++){
                let tradeInfo = data[i]

                //console.log("tradeInto: ",tradeInfo)

                //let price
                let price = tradeInfo.price
                let amount = tradeInfo.size
                // console.log("price: ",price)
                // console.log("amount: ",amount)

                let normalized = {}
                normalized.trade_id = tradeInfo.trdMatchID
                normalized.time = new Date(tradeInfo.timestamp).getTime()
                normalized.unix = new Date(tradeInfo.timestamp).getTime()
                normalized.size = tradeInfo.size
                normalized.side = tradeInfo.side
                normalized.price = tradeInfo.price
                clean.push(normalized)
            }

            //push trades to engine
            engine.update(clean,true,function(err){
                if(err) throw Error(error)
            })


        });


        //get signal



        //translate signal to prediction



    }catch(e){
        log.error(e)
    }
}


//Sub to signaling













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

