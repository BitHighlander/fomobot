
require("dotenv").config()
require("dotenv").config({path:'../../../.env'})

const {redis,redisQueue} = require("../index")

/*
    Status persistence

 */

let setReady = async function(){
    console.log("online!")
    let result = await redis.setex("COSMOS:tx:signer:status",5,'online')
    console.log("result: ",result)
}
setInterval(setReady,5000)











/*
    Scored Set tools

 */

//add block

let block = {
    height: 1913963,
    block:'2E308252FE3CC516FDA8A1C55770E166CA10B452585111D6A24EB5257BBAA468'
}

//add to set
//redis.zadd()

//get highest
// redis.zrangebyscore("COSMOS:blocks:scanned","-inf","+inf", "WITHSCORES","LIMIT",0,1)
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

//get lowest
// redis.zrange("COSMOS:blocks:scanned","1","1","WITHSCORES")
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

//get highest
// redis.zrange("COSMOS:blocks:scanned","-1","-1","WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })


// redis.zcard("COSMOS:blocks:scanned")
//     .then(function(resp){
//         console.log("total blocks scanned resp: ",resp)
//     })
//
// redis.zrevrangebyscore("COSMOS:blocks:scanned","+inf","-inf")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// redis.zrangebyscore("COSMOS:blocks:scanned","-inf","+inf", "WITHSCORES","LIMIT",0,1)
//     .then(function(resp){
//         console.log("lowest block: ",resp)
//     })

// redis.zrangebyscore("COSMOS:blocks:scanned","1914093","(1914094", "WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })

//get at score
// redis.zrange("COSMOS:blocks:scanned","1914093","1914094")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })

//get x between y
// redis.zrange("COSMOS:blocks:scanned","-1","-1","WITHSCORES")
//     .then(function(resp){
//         console.log("highest block: ",resp)
//     })


/*
write
 */

// redis.set("test","foo")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


/*
Read
 */

// redis.get("test")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })



// subscriber.subscribe("COSMOS")
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
