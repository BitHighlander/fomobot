require('dotenv').config()
require('dotenv').config({path:"../../.env"});

let {BitmexAPI,BitmexSocket} = require("bitmex-node");
//var datetime = require('node-datetime');
var moment = require('moment');
//sub to pubsub
// const pubsubLib = require("redis")
//     , subscriber = pubsubLib.createClient()
//     , publisher = pubsubLib.createClient();

if(!process.env['API_KEY_PUBLIC']) throw Error(" Missing API_KEY_PUBLIC! ")
if(!process.env['API_KEY_PRIVATE']) throw Error(" Missing API_KEY_PRIVATE! ")
console.log("process.env['API_KEY_PUBLIC']: ",process.env['API_KEY_PUBLIC'])
console.log("process.env['API_KEY_PRIVATE']: ",process.env['API_KEY_PRIVATE'])

const bitmex = new BitmexAPI({
    "apiKeyID": process.env['API_KEY_PUBLIC'],
    "apiKeySecret": process.env['API_KEY_PRIVATE'],
    //"proxy": "https://cors-anywhere.herokuapp.com/"
    "testnet": true
});


// const bitmexSocket = new BitmexSocket({
//     "apiKeyID": "",
//     "apiKeySecret": "",
//     //"proxy": "https://cors-anywhere.herokuapp.com/"
// });

// const bitmex = new BitmexAPI({
//     "apiKeyID": "",
//     "apiKeySecret": "",
//     "testnet":true
//     //"proxy": "https://cors-anywhere.herokuapp.com/"
// });


//pubsub
// subscriber.subscribe("bitmex-signals");
// subscriber.on("message", async function (channel, payloadS)
// {
//     var tag = TAG+ " | payments | "
//     let debug = true
//     try{
//         if(debug) console.log(tag,"payloadS: ",payloadS)
//         let payload = JSON.parse(payloadS)
//         if(debug) console.log(tag,"payload: ",payload)
//
//         //
//
//
//     }catch(e){
//         console.error(tag,"Error: ",e)
//     }
// })



// try{
//
//     let trades = bitmexSocket.trade("XBTUSD")
//     console.log(trades)
//     trades.subscribe()
//     console.log(trades)
//
//     // trades.on(function(err,resp){
//     //     console.log(err,resp)
//     // })
//
// }catch(e){
//     console.error(e)
// }
//
//
//





// bitmex.User.getExecutionHistory()
//     .then(function(resp){
//         console.log(resp)
//     })

// bitmex.User.getWalletSummary()
//     .then(function(resp){
//
//         console.log(resp)
//
//     })
//   .catch(function(e){
//       console.error(e)
//   })


// bitmex.User.getDepositAddress()
//     .then(function(resp){
//         console.log(resp)
//     })

// bitmex.User.getWalletHistory()
//     .then(function(resp){
//         console.log(resp)
//     })

bitmex.User.getWallet()
    .then(function(resp){
        console.log("balance: ",parseInt(resp.deltaAmount) / 100000000)
        console.log("address: ",resp.addr)
    })

// bitmex.Execution.getTradeHistory()
//     .then(function(resp){
//         console.log(resp.length)
//     })


//dunno wtf this is?
// bitmex.Stats.history()
//     .then(function(resp){
//         console.log(resp)
//     })


// bitmex.Position.get()
//     .then(function(resp){
//         console.log(resp)
//         console.log(resp[0])
//     })

//trade!

//buy 1 btc of longs



//Buy USD contract
//amount is in USD
// bitmex.Order.new({symbol:"XBTUSD",orderQty:1000,price:"10400"})
//     .then(function(resp){
//         console.log(resp)
//     })
//     .catch(function(e){
//         console.error(e)
//     })


// let order = { symbol: 'XBTUSD', orderQty: -1000, price: '6753' }
let order = { symbol: 'XBTUSD', orderQty: -100, price: '6753' }


//works
//let order = {symbol:"XBTUSD",orderQty:-100,price:"6700"}
//leverage seems to be working
bitmex.Order.new(order)
    .then(function(resp){
        console.log(resp)
    })
    .catch(function(e){
        console.error(e)
        console.error(e.message)
        let trimBack = e.message.split(" XBt ")
        console.error(trimBack)
        let trimFront = trimBack[0].split("Account has insufficient Available Balance, ")
        let neededForOrder = trimFront[1]
        console.error("neededForOrder: ",parseInt(neededForOrder) / 100000000)
    })



// bitmex.Position.updateLeverage({symbol:"XBTUSD",leverage:"6"})
//   .then(function(resp){
//       console.log(resp)
//   })
//   .catch(function(e){
//       console.error(e)
//       console.error(e.message)
//       let trimBack = e.message.split(" XBt ")
//       console.error(trimBack)
//       let trimFront = trimBack[0].split("Account has insufficient Available Balance, ")
//       let neededForOrder = trimFront[1]
//       console.error("neededForOrder: ",parseInt(neededForOrder) / 100000000)
//   })



// backfill

// let now = new Date();
// now = moment(now).toISOString();
// console.log("now: ",now);
// // //now = parseInt(now/1000)
// // now = new Date()
// // console.log("now: ",now)
// let hourAgo = moment(new Date()).subtract(1, 'm');
// hourAgo = moment(hourAgo).toISOString();
//
// // hourAgo = hourAgo - 1000 * 60 * 60
// console.log("hourAgo: ",hourAgo);
//let dateTimeHourAgo = new datetime.create(hourAgo)

// let dateTimeHourAgo = new Date(hourAgo)
// console.log("dateTimeHourAgo: ",dateTimeHourAgo)
// hourAgo = parseInt(hourAgo/1000)

//want "2019-09-07 20:17:53.556021"


// let get_batch = async function(){
//     try{
//
//     }catch(e){
//
//     }
// }
//
//
// let backfilling = true
//
// while(backfilling){
//
// }








// bitmex.Trade.get({symbol:"XBT:monthly",count:"200",startTime:hourAgo,endTime:now})
//     .then(function(resp){
//         console.log(resp);
//
//         let trades = [];
//
//         for(let i = 0; i < resp.length; i++){
//             let entry = resp[i];
//             let normalized = {};
//             normalized.trade_id = entry.trdMatchID;
//             normalized.time = entry.timestamp;
//             normalized.unix = new Date(entry.timestamp).getTime();
//             normalized.human = moment(new Date(entry.timestamp)).calendar();
//             normalized.size = entry.size;
//             normalized.side = entry.side;
//             normalized.price = entry.price;
//             trades.push(normalized)
//         }
//         //console.log(trades)
//         //cb(null, trades)
//
//
//     })
//     .catch(function(e){
//         console.error(e)
//     });


/*

{
    "_id" : "2a5ffd9c",
    "order_id" : 1089,
    "time" : 1566962710012.0,
    "execution_time" : 42686,
    "slippage" : 0.000111842541537742,
    "type" : "sell",
    "size" : "0.09475407",
    "fee" : 0,
    "price" : "10103.49",
    "order_type" : "maker",
    "profit" : 0.0034747976075875,
    "id" : "2a5ffd9c",
    "selector" : "gdax.BTC-USD",
    "session_id" : "f5af3710",
    "mode" : "paper"
}

 */

// bitmex.Trade.get({symbol:"XBT:monthly",count:"200",startTime:hourAgo,endTime:now})
//     .then(function(resp){
//         console.log(resp)
//
//         let output = []
//
//         for(let i = 0; i < resp.length; i++){
//             let entry = resp[i]
//             let normalized = {}
//             normalized.order_id = entry.trdMatchID
//             normalized.time = entry.timestamp
//             normalized.size = entry.size
//             normalized.size = entry.size
//         }
//
//
//     })
//     .catch(function(e){
//         console.error(e)
//     })




// bitmex.Trade.get({symbol:"XBTUSD",count:"500",startTime:hourAgo,endTime:now})
//     .then(function(resp){
//         console.log(resp.length)
//     })
//     .catch(function(e){
//         console.error(e)
//     })
