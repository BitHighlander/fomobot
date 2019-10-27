
let Accounting = require("./index")
let redis = require("fakeredis").createClient("6379", "127.0.0.1");
let accounting = new Accounting(redis)


let testAccount = "mrBob"

accounting.balance(testAccount,"BTC")
    .then(function(resp){
        console.log(resp)
        //assert(resp).to.Be
    })
