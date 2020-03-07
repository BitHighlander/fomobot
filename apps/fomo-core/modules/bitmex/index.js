let {BitmexAPI,BitmexSocket} = require("bitmex-node");
//var datetime = require('node-datetime');
var moment = require('moment');

// const bitmex = new BitmexAPI({
//     "apiKeyID": "kWKByIp9ynsprvY_X451ny3W",
//     "apiKeySecret": "K5kxJo0F-Wg_gefxlmelrxJctRsGzWv5crlzP7bW86Wyui9i",
//     //"proxy": "https://cors-anywhere.herokuapp.com/"
// });


// const bitmexSocket = new BitmexSocket({
//     "apiKeyID": "kWKByIp9ynsprvY_X451ny3W",
//     "apiKeySecret": "K5kxJo0F-Wg_gefxlmelrxJctRsGzWv5crlzP7bW86Wyui9i",
//     //"proxy": "https://cors-anywhere.herokuapp.com/"
// });

const bitmex = new BitmexAPI({
    "apiKeyID": "FGiRBC_lzxicpWlsSA2714Sy",
    "apiKeySecret": "APSAKyl4BZi1OB0RMuptfTvB7b7E3PlVDDuj_wSGMbujh8-D",
    "testnet":true
    //"proxy": "https://cors-anywhere.herokuapp.com/"
});


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
//         console.log(resp)
//     })


// bitmex.User.getDepositAddress()
//     .then(function(resp){
//         console.log(resp)
//     })

// bitmex.User.getWalletHistory()
//     .then(function(resp){
//         console.log(resp)
//     })

// bitmex.User.getWallet()
//     .then(function(resp){
//         console.log(resp)
//     })

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

//leverage seems to be working
// bitmex.Order.new({symbol:"XBTUSD",orderQty:10000,price:"10500",leverage:"100"})
//     .then(function(resp){
//         console.log(resp)
//     })
//     .catch(function(e){
//         console.error(e)
//     })







// backfill

let now = new Date();
now = moment(now).toISOString();
console.log("now: ",now);
// //now = parseInt(now/1000)
// now = new Date()
// console.log("now: ",now)
let hourAgo = moment(new Date()).subtract(1, 'm');
hourAgo = moment(hourAgo).toISOString();

// hourAgo = hourAgo - 1000 * 60 * 60
console.log("hourAgo: ",hourAgo);
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
