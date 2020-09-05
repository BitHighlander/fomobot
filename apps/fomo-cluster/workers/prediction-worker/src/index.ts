
const TAG = " | prediction-worker | "

require('dotenv').config()
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"../../../../.env"});

const queue = require("@fomobro/redis-queue")
const log = require("loggerdog-client")()
const wait = require('wait-promise');
const sleep = wait.sleep;

let fomo = require("fomo-api")
let shortid = require('shortid');

let urlSpec = "http://127.0.0.1:8000/spec/swagger.json"
// let urlSpec = "https://fomobro.com/spec/swagger.json"
// console.log(urlSpec)

let onStart = async function(){
    try{
        await fomo.init(urlSpec,{apiKey:process.env['API_KEY_PUBLIC']})

        //health
        let health = await fomo.health()
        console.log("health: ",health)

    }catch(e){
        console.error(e)
    }
}
onStart()

let do_work = async function () {
    let tag = TAG + " | do_work | "
    let block
    try {

        //all work
        let allWorkHigh = await queue.count("fomo-signal")
        log.debug(tag, "HIGH WORK LEFT: ", allWorkHigh)

        let signal = await queue.getWork("fomo-signal", 1)
        if (signal) {
            log.info("**** Receive Signal! *****")
            if(!signal.event) throw Error(" Invalid signal! ")
            //if stale/ ignore
            //TODO

            //if buy AND !IS_BULL
            if(signal.event === 'buy'){

                //make prediction
                let lastPrice = signal.lastPrice

                //up x percent in x time
                // 0.001 pct in 10 minutes
                let diff = parseFloat(lastPrice) * 0.0001
                let pricePrediction = parseFloat(lastPrice) + diff

                let inTenMinutes = new Date().getTime()
                inTenMinutes = inTenMinutes + 1000 * 60 * 10
                let prediction = {
                    coin:"BTC",
                    time:inTenMinutes.toString(),
                    price:pricePrediction.toString()
                }
                console.log("prediction: ",prediction)

                let predictionResult = await fomo.predict(prediction)
                console.log("predictionResult: ",predictionResult)

            }

            //if sell AND isBull
            if(signal.event === 'sell'){

                //make prediction
                let lastPrice = signal.lastPrice
                //down x percent in x time
                let diff = parseFloat(lastPrice) * 0.0001
                let pricePrediction = parseFloat(lastPrice) - diff

                let inTenMinutes = new Date().getTime()
                inTenMinutes = inTenMinutes + 1000 * 60 * 10
                let prediction = {
                    coin:"BTC",
                    time:inTenMinutes.toString(),
                    price:pricePrediction.toString()
                }
                console.log("prediction: ",prediction)

                let predictionResult = await fomo.predict(prediction)
                console.log("predictionResult: ",predictionResult)
            }

        } else {
            log.debug(tag, " * WORKER HEALTHY * queues empty! ")
        }

    } catch (e) {
        log.error(tag, {e})
        //dead letter queue
        //redis.lpush(EXCHANGE + ":signal:ingest:deadletter", block)
        await sleep(300)
    }
    //dont stop working even if error
    await sleep(30)
    do_work()
}

do_work()