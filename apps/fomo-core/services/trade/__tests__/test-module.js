/*
    Backfill Modules

    //get oldest

    //get newest

    //look for gaps

    //sync to current

    //


 */

require('')
let client = require("../index.js")




//start
// let start = ""
// let end = ""

//mode days (assure x days are backfilled FROM TODAY!)
let modelPath = "/home/highlander/WebstormProjects/fomo-core/services/trade/models/temp.06386bd67dd782a007ba18193c5bfa4f4e6fd42a57849b3db7b5ba911f1eb9db-20190927_040010+0000.json"

//end
ipcEvent = {}
client.trade(modelPath,ipcEvent)
    .then(function(resp){
        console.log("resp: ",resp)
    })
