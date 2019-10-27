require('dotenv').config()
require('dotenv').config({path:"./../.env"});
let log = require("default-logger")()

let wait = require('wait-promise');
let sleep = wait.sleep;

const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')

let bot = require("../index.js")


let run_test = async function(){
    let tag = " | run-test | "
    try{
        bot.init("ta_ultosc")

        await sleep(1000)

        //get recent history
        let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"},{limit:10000,sort:{time:-1}})
        log.info(tag,"total trades: ",allTrades.length)

        //Load trades to engine
        bot.load(allTrades)
        //


    }catch(e){
        log.error(e)
    }
}


run_test()

//get trades from db

//push them
