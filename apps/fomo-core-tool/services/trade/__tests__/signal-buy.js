require('dotenv').config()
require('dotenv').config({path:"../../../.env"});
const {subscriber,publisher,redis} = require('@fomobro/default-redis')


let work = {signal:"sell",time:new Date().getTime()}


//redis.srem(ASSET+':blocks:scanned',work.height)

//add address
redis.lpush("fomo:signal",JSON.stringify(work))
console.log("inserted block:",work)


// let symbol = "XBTUSD"
// let exchange = "bitmex"
// let amount = "10000"
// let price = "10500"
// let leverage = "20"
//
// let work = {symbol,exchange,amount,price,leverage}
//
//
// //redis.srem(ASSET+':blocks:scanned',work.height)
//
// //add address
// redis.lpush("fomo:trades",JSON.stringify(work))
// console.log("inserted block:",work)
//expect to be saved to redis
