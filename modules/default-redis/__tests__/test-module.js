
require("dotenv").config()
require("dotenv").config({path:'../../../.env'})

const {redis,redisQueue} = require("../index")

/*
    Status persistence

 */



//get highest
// redis.zrangebyscore("fomo:blocks:scanned","-inf","+inf", "WITHSCORES","LIMIT",0,1)
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

//get lowest
// redis.zrange("fomo:blocks:scanned","1","1","WITHSCORES")
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

//get highest
// redis.zrange("fomo:blocks:scanned","-1","-1","WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })


// redis.zcard("fomo:blocks:scanned")
//     .then(function(resp){
//         console.log("total blocks scanned resp: ",resp)
//     })
//
// redis.zrevrangebyscore("fomo:blocks:scanned","+inf","-inf")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// redis.zrangebyscore("fomo:blocks:scanned","-inf","+inf", "WITHSCORES","LIMIT",0,1)
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

// redis.zrangebyscore("fomo:blocks:scanned","1914093","(1914094", "WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })

//get at score
// redis.zrange("fomo:blocks:scanned","1914093","1914094")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })

//get x between y
// redis.zrange("fomo:blocks:scanned","-1","-1","WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })


/*
write
 */

// redis.set("__test__","foo")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


/*
Read
 */

// redis.get("__test__")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })



// subscriber.subscribe("fomo")
// subscriber.on('message', async function (channel, payloadS) {
//     let tag = TAG + ' | events | '
//     try {
//         let payload = JSON.parse(payloadS)
//         console.log("payload: ",payload)
//         //on block ingest block
//
//         //if tx
//         //push to broadcast queue
//
//     }catch(e){
//         log.error(tag,e)
//         throw e
//     }
// })
