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
const tradesDB = db.get('trades')
let engineFactory = require('./lib/engine')
let path = require('path')


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
};

/********************************
 //function primary
 //********************************/
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


        var eventBus = new EventEmitter()
        var conf = require('./conf')
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

        s.options.strategy =  'ta_ultosc' //very active!

        s.strategy = require(path.resolve(__dirname, `./extensions/strategies/${s.options.strategy}/strategy`))

        ENGINE = engineFactory(s, conf)




    }catch(e){
        console.error(tag,"Error: ",e)
        throw e
    }
}

