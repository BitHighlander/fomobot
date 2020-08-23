require('dotenv').config()
require('dotenv').config({path:"./../.env"});
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"./../../.env"});
require('dotenv').config({path:"../../../../.env"});
require('dotenv').config({path:"../../../../../.env"});

const queue = require("@fomobro/redis-queue")
let signal ={}
signal.time = new Date().getTime()
signal.strategy = "test"
signal.event = "buy"
signal.lastPrice = "11581.5"


queue.createWork("fomo-signal",signal)