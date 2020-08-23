/*
    Test module

 */


require("dotenv").config({path:'./../../.env'})

require("dotenv").config({path:'../../../.env'})
let queue = require("../index")
//let queue = require("../lib/index.js")


let settings = {
    type:'lifo'
}

queue.init('test',settings)

let ASSET = "BNB"

//get global queues

//crud

//add 5 pieces of work


let run_test = async function(){
    try{
        await queue.delete('test-queue')
        let resp = await queue.createWork("test-queue",{work:2})
        let resp2 = await queue.createWork("test-queue",{work:2})

        console.log(resp)
        console.log(resp2)

        //if lifo
        //work = 0

        //verify only one work
        let work = await queue.viewWork('test-queue',10)
        console.log(work)

    }catch(e){
        throw e
    }
}
run_test()


// let run_test = async function(){
//     try{
//
//         await queue.delete('test-queue')
//
//         //doesnt throw on expired
//         let expire = await queue.getWork('test-queue',1)
//         console.log("expire: ",expire)
//
//
//         for(let i = 0; i < 5; i++){
//             await queue.createWork("test-queue",{work:i})
//         }
//
//         //start working
//         let work = await queue.getWork('test-queue')
//         console.log("work: ",work)
//
//         //if lifo
//         //work = 0
//
//     }catch(e){
//         throw e
//     }
// }
// run_test()

// queue.getInfo('')
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// queue.count('')
// queue.count(ASSET+":queue:block:ingest:high")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// queue.getWork(ASSET+":queue:block:ingest:high")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

