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
        await queue.delete('__test__-queue')
        let resp = await queue.createWork("__test__-queue",{work:2})
        let resp2 = await queue.createWork("__test__-queue",{work:2})

        console.log(resp)
        console.log(resp2)

        //if lifo
        //work = 0

        //verify only one work
        let work = await queue.viewWork('__test__-queue',10)
        console.log(work)

    }catch(e){
        throw e
    }
}
run_test()


// let run_test = async function(){
//     try{
//
//         await queue.delete('__test__-queue')
//
//         //doesnt throw on expired
//         let expire = await queue.getWork('__test__-queue',1)
//         console.log("expire: ",expire)
//
//
//         for(let i = 0; i < 5; i++){
//             await queue.createWork("__test__-queue",{work:i})
//         }
//
//         //start working
//         let work = await queue.getWork('__test__-queue')
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

