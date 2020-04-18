/*
    Test module

 */
require('dotenv').config()
require('dotenv').config({path:"./../.env"});
require('dotenv').config({path:"./../../.env"});
require('dotenv').config({path:"./../../../.env"});
require('dotenv').config({path:"../../../../.env"});
require('dotenv').config({path:"../../../../../.env"});
const queue = require("@fomobro/redis-queue")


let signal = {}
signal.time = new Date().getTime()
signal.strategy = "test"
signal.event = 'sell'
signal.lastPrice = 7051


//add address
queue.createWork("fomo-signal",signal)
console.log("inserted signal:",signal)
//expect to be saved to redis
