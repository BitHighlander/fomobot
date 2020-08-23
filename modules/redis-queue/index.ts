/*
   Redis queue toolkit

   index queues

   document setting configurations and best practices

 */

const log = require("@fomobro/loggerdog-client")()
const { subscriber, publisher, redis } = require('@fomobro/default-redis')

const QUEUE_INTERVAL_TIME:number = 10
let QUEUE_NAME:string

let QUEUE_INFO:any = {}

let WORK_ADDED:any = {}
let WORK_REMOVED:any = {}

module.exports = {
    init: function (name:string) {
        QUEUE_NAME = name
    },
    getInfo:async function(){
        return QUEUE_NAME
    },
    viewWork:async function(name:string,max:number){
        return redis.lrange(name,0,max)
    },
    delete:async function(name:string){
        return redis.del(name)
    },
    count:async function(name:string){
        return redis.llen(name)
    },
    createWork:async function(name:string,work:any){
        //TODO calculate work added per second
        if(!WORK_ADDED[name]) WORK_ADDED[name] = 0
        WORK_ADDED[name] = WORK_ADDED[name] + 1

        //verify work doesnt already exist
        redis.lrem(name,0,JSON.stringify(work))
        return redis.lpush(name,JSON.stringify(work))
    },
    getWork:async function(name:string,interval:number){
        if(!interval) interval = QUEUE_INTERVAL_TIME
        //TODO calculate work completed per second

        if(!WORK_REMOVED[name]) WORK_REMOVED[name] = 0
        WORK_REMOVED[name] = WORK_REMOVED[name] + 1
        //clean out
        let result = await redis.brpop(name,QUEUE_INTERVAL_TIME)
        if(result && result[1]) result = JSON.parse(result[1])
        return result
    }
 }


 //ontick
const onTick = function(){
    //clear buckets

    //calculate work per second

}
setInterval(onTick,1000)
