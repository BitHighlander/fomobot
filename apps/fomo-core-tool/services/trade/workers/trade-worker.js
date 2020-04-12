/*
      Execute trade signals

            Bitmex

 */
require('dotenv').config()
require('dotenv').config({path:"../../../.env"})

const TAG = " | trade-worker | "

let log = require("default-logger")()
const {subscriber,publisher,redis} = require('@fomobro/default-redis')


let wait = require('wait-promise');
let sleep = wait.sleep;

let {BitmexAPI,BitmexSocket} = require("bitmex-node");
const bitmex = new BitmexAPI({
    "apiKeyID": "FGiRBC_lzxicpWlsSA2714Sy",
    "apiKeySecret": "APSAKyl4BZi1OB0RMuptfTvB7b7E3PlVDDuj_wSGMbujh8-D",
    "testnet":true
    //"proxy": "https://cors-anywhere.herokuapp.com/"
});


let IS_PAPER = false
let IS_TESTNET = true

//let position

let CURRENT_POSITION = {}


let IS_BULL = false
let IS_BEAR = false
let PCT_IN_POSITION = 0
let BALANCE_POSITION = 0
let BALANCE_AVAILABLE = 0


/*
    BOT LOGIC V1

    Every signal move position 20pct




 */


let do_work = async function(){
    let tag = TAG+" | do_work | "
    let signal
    try{

        //all work
        let allWork = await redis.llen("fomo:signal")
        log.info(tag,"allWork: ",allWork)


        signal = await redis.blpop("fomo:signal",5)
        log.info("signal: ",signal)
        if(signal && signal[1] !== 'fomo:signal'){

            signal = JSON.parse(signal[1])

            log.info(tag,signal)

            try{
                signal = signal.signal.toUpperCase()

                log.info("PCT_IN_POSITION: ",PCT_IN_POSITION)

                log.info("BALANCE_AVAILABLE: ",BALANCE_AVAILABLE)
                log.info("BALANCE_POSITION: ",BALANCE_POSITION)

                log.info("IS_BEAR: ",IS_BEAR)
                log.info("IS_BULL: ",IS_BULL)



                if(signal === 'BUY'){
                    //increase position x percent
                    let result = await bitmex.Order.new({symbol:"XBTUSD",orderQty:1000,price:"9400",leverage:"10"})
                    log.info(tag,"trade: ",result)
                }

                if(signal === 'SELL'){
                    //decrease position x percent
                    let result = await bitmex.Order.new({symbol:"XBTUSD",orderQty:-1000,price:"9000",leverage:"10"})
                    log.info(tag,"trade: ",result)
                }

                //
                // if(IS_BEAR && signal === 'BUY'){
                //
                //     //lower position x percent
                //     let result = await bitmex.Order.new({symbol:"XBTUSD",orderQty:1000,price:"10500",leverage:"10"})
                //     log.info(tag,"trade: ",result)
                // }
                //
                // if(IS_BEAR && signal === 'SELL'){
                //     //increase position x percent
                // }
                //
                // if(IS_BULL && signal === 'BUY'){
                //     //increase position x percent
                //     let result = await bitmex.Order.new({symbol:"XBTUSD",orderQty:1000,price:"10500",leverage:"10"})
                //     log.info(tag,"trade: ",result)
                // }
                //
                // if(IS_BULL && signal === 'SELL'){
                //     //decrease position x percent
                // }


                await sleep(1000)
            }catch(e){
                log.error(tag,"invalid signal: ",signal)
                log.error("error: ",e)
                await sleep(13000)
            }
        } else {

            //get starting position
            let summary = await bitmex.User.getWallet()
            //log.info("summary: ",summary)

            let balance = summary.amount
            //log.info("balance: ",balance)

            let positions = await bitmex.Position.get()

            //log.info("positions: ",positions[0])

            // log.info("unrealized profit: ",positions[0].unrealisedGrossPnl)
            //
            // log.info("currentQty: ",positions[0].lastValue)
            // log.info("currentQty: ",positions[0].currentQty)
            // log.info("markPrice: ",positions[0].markPrice)
            // log.info("marginCallPrice: ",positions[0].marginCallPrice)
            // log.info("lastPrice: ",positions[0].lastPrice)
            // log.info("leverage: ",positions[0].leverage)
            // log.info("lastValue: ",positions[0].lastValue)

            BALANCE_POSITION = Math.abs(positions[0].lastValue)
            BALANCE_AVAILABLE = balance

            //percent IN
            let pctAvaible = balance / Math.abs(positions[0].lastValue)
            pctAvaible = pctAvaible * 100
            pctAvaible = pctAvaible - 100
            PCT_IN_POSITION = pctAvaible
            log.info("pctInPosition: ",pctAvaible)

            //isBull
            let isBull = false
            if(positions[0].lastValue > 0){
                isBull = true
                IS_BULL = true
            }

            //isBear
            let isBear = false
            if(positions[0].lastValue < 0){
                isBear = true
                IS_BEAR = true
            }

            //display position
            log.info("PCT_IN_POSITION: ",PCT_IN_POSITION)

            log.info("BALANCE_AVAILABLE: ",BALANCE_AVAILABLE)
            log.info("BALANCE_POSITION: ",BALANCE_POSITION)

            log.info("IS_BEAR: ",IS_BEAR)
            log.info("IS_BULL: ",IS_BULL)
        }

    } catch(e) {
        log.error(tag,e)
        //dead letter queue?
        //TODO fix errors dont shh them (need cointainers)
        //log.error("Error checking for trades: FAIL WORK", e)
        //toss back into work queue (at end)
        await sleep(30000)
    }
    //dont stop working even if error
    do_work()
}
//start working on install
log.info(TAG," worker started! ")

let onStart = async function (){
    //
    let tag = " | onStart | "

    try{
        //get starting position
        let summary = await bitmex.User.getWallet()
        //log.info("summary: ",summary)

        let balance = summary.amount
        log.info("balance: ",balance)

        let positions = await bitmex.Position.get()

        //log.info("positions: ",positions[0])

        log.info("unrealized profit: ",positions[0].unrealisedGrossPnl)

        log.info("currentQty: ",positions[0].currentQty)
        log.info("markPrice: ",positions[0].markPrice)
        log.info("marginCallPrice: ",positions[0].marginCallPrice)
        log.info("lastPrice: ",positions[0].lastPrice)
        log.info("leverage: ",positions[0].leverage)
        log.info("lastValue: ",positions[0].lastValue)

        BALANCE_POSITION = Math.abs(positions[0].lastValue)
        BALANCE_AVAILABLE = balance

        //percent IN
        let pctAvaible = balance / Math.abs(positions[0].lastValue)
        pctAvaible = pctAvaible * 100
        pctAvaible = pctAvaible - 100
        PCT_IN_POSITION = pctAvaible
        log.info("pctInPosition: ",pctAvaible)

        //isBull
        let isBull = false
        if(positions[0].lastValue > 0){
            isBull = true
            IS_BULL = true
        }

        //isBear
        let isBear = false
        if(positions[0].lastValue < 0){
            isBear = true
            IS_BEAR = true
        }

        //if buy signal, be more bullish



        //if sell signall be more bearish

        //

        do_work()


    }catch(e){
        console.error(e)
    }
}

onStart()
