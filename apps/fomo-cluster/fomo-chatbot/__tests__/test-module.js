
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"./../../.env"});
require('dotenv').config({path:"../../../.env"});
require('dotenv').config({path:"../../../../.env"});


const {redis,subscriber,publisher} = require("@fomobro/default-redis")



let message = {
    channel:"markets",
    msg:"test2",
    view:{
        icon_emoji: ':robot:',
    }
}


redis.publish("publish",JSON.stringify(message))
