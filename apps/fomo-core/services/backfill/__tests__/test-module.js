/*
    Backfill Modules

    //get oldest

    //get newest

    //look for gaps

    //sync to current

    //


 */


let client = require("../index.js")




//start
// let start = ""
// let end = ""

//mode days (assure x days are backfilled FROM TODAY!)
let days = 2

//end
ipcEvent = {}
client.backfill(days,ipcEvent)
    .then(function(resp){
        console.log("resp: ",resp)
    })
