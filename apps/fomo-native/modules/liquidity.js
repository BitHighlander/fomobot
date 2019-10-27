/*
    Global exchange controller
                -Highlander

    Routes commands to all exchange controllers

    maintains pubsub on all events

    maintains in memory real time balance object exportable on all accounts

    audits and maintains completeness assertion on all balance data

 */
const TAG = " | nexus | "
// require('dotenv').config({path:"../.env"});
// const log = require('dumb-lumberjack')()
// var _ = require('lodash');
//
// let exchanges = {}
// //let binance = require("../__mocks__/binance-client.js")
// // let binance = require("./binance-client.js")
// // exchanges['binance'] = binance
// // let exchangeNames = Object.keys(exchanges)
//
// //
// let audit = require("./audit.js")
//
//
// //redis
// const util = require('./redis')
// const redis = util.redis

//mongo
// let {reportLA,credits,debits,trades,transfers,balances} = require('./mongo.js')
// let balancesDB = balances
// let transfersDB = transfers
// let tradesDB = trades




/*
    MONGO

        fomo schema
  [
  'binance-balances',
  'binance-credits',
  'binance-debits',
  'binance-transfers',
  'binance-trades',
  'binance-txs',
  'binance-history'
  ]
 */

// let mongo = require('./mongo')
// let views = require('./views')
// let signing = require('./signing')

//view collections
//console.log(Object.keys(mongo))

/**************************************
 // Module
 //*************************************/

// module.exports = {
//     initialize: function () {
//         return initialize_service();
//     },
//     // status: function () {
//     //     return view_status();
//     // },
//     // exchanges: function () {
//     //     return exchangeNames;
//     // },
//     // coins: async function () {
//     //     return await binance.coins();
//     // },
//     // clearDB: function () {
//     //     return reset_database();
//     // },
//     // markets: function () {
//     //     return exchangeNames;
//     // },
//     // balances: function (exchange) {
//     //     return get_balance(exchange);
//     // },
//     // estimateUSD: function (exchange) {
//     //     return get_usd_value(exchange);
//     // },
//     // estimateUSDValueOfBalances: function (balances) {
//     //     return binance.estimateUSDValueOfBalances(balances);
//     // },
//     // trade: function (exchange, type, coin, amount, price) {
//     //     return trade_controler(exchange, type, coin, amount, price);
//     // },
//     // withdraw: function (exchange, coin, address, amount) {
//     //     return withdraw_from_exchange(exchange, coin, address, amount);
//     // },
//     // audit: function () {
//     //     return audit.auditAccount('binance');
//     // },
//     // buildTXdb: function () {
//     //     return rebuild_exchange_history();
//     // },
//     // auditTransfers: function (coin) {
//     //     return audit_transfers(coin);
//     // },
//     // auditTrades: function (market) {
//     //     return audit_trades(market);
//     // },
//     // auditAllTransfers: function () {
//     //     return audit_all_transfers();
//     // },
//     // auditAllTrades: function () {
//     //     return audit_all_trades();
//     // },
// }

/**************************************
 // Primary
 //*************************************/


/*
        Status

 */

// let get_status = async function () {
//     let tag = TAG + ' | trade_controler | '
//     try {
//
//         //actions done in
//         //hour day week
//
//         //balance check?
//
//         //pending actions
//
//         return true
//     } catch (e) {
//         log.error(tag, 'ERROR: ', e)
//         throw e
//     }
// }

/*
        Tradeing

 */

// let trade_controler = async function (exchange, type, coin, amount, price) {
//     let tag = TAG + ' | trade_controler | '
//     try {
//         type = type.toLowerCase()
//         log.debug(tag,"inputs; ",{exchange, type, coin, amount, price})
//
//         //get market from coin
//         let market = coin+"_BTC"
//
//         if(config.NODE_ENV === 'prod'){
//             let result = await binance[type](market, price, amount)
//             log.debug(tag,"result: ",result)
//         }
//         //TODO else mock
//
//
//
//         return result
//     } catch (e) {
//         log.error(tag, 'ERROR: ', e)
//         throw e
//     }
// }


/*

      Get last checkpoint

      check signature

      if pass
        Get current balances
        get transactions from checkpoint
        replay transactions
        if within tolerance start


    if no checkpoint,
        Build from scratch

 */

let initialize_service = async function () {
    let tag = TAG + ' | initialize_service | '
    try {
        let successStart = false
        //TODO Get all accounts
        // HACK binance only
        console.log(tag,"**************** Start app init")

        // views.displayStringToChannel("Starting up exchange services!",'wallet')
        //
        // let tests = function(){
		 //    views.displayStringToChannel("Starting up exchange services!",'wallet')
        // }
        // setInterval(tests,1000)

        //get oldest history object
        // let checkpoint = await mongo['binance-balances'].findOne({},{sort:{nonce:-1}})
        // log.info(tag,"checkpoint: ",checkpoint)
        //
        // //if no history rebuild
        // if(!checkpoint){
        //     log.info(tag,"checkpoint new history")
        //     views.displayStringToChannel("No Checkpoints found! rebuilding history!",'help')
        //
        //     //txs founds?
        //     let txs = await mongo['binance-txs'].find()
        //     if(txs.length === 0){
        //
        //         views.displayStringToChannel("No tx history found! rebuilding data from exchange!",'help')
        //         //push all work to queue
        //         await rebuild_exchange_history()
        //         await pause(1)
        //     }
        //
        //
        //     //wait for queues to empty
        //     let readyForAudit = false
        //     while(!readyForAudit){
        //         let queueTrades = await redis.llen('queue:trades:audit')
        //         let queueTransfers = await redis.llen('queue:transfers:audit')
        //
        //         if(queueTrades === 0 && queueTransfers === 0){
        //             readyForAudit = true
        //         }
        //         let msg = " Building TX database! trades:"+queueTrades+" transfers: "+queueTransfers
        //         views.displayStringToChannel(msg,'help')
        //         await pause(5)
        //     }
        //
        //     views.displayStringToChannel("ready to begin audit!  ",'help')
        //     let startup = await audit.auditAccount('binance')
        //     log.info(tag,"startup: ",startup)
        //
        //     // // :SUCCESS:
        //     // //get balances from binance
        //     // let balancesBinance = await get_balance('binance')
        //     //
        //     // get total value USD on both
        //     //
        //     //
        //     // if in tolerance than start, else AUDIT TRUMPET OF DOOM!!!
        //     //
        //     //
        //     // if successfull
        //     // successStart = true
        // } else {
        //     //validate checkpoint
        //     //Get current balances
        //     //get transactions from checkpoint
        //     //replay transactions
        //     //if within tolerance start
        //
        //     log.debug(tag,"checkpoint: ",checkpoint)
        //
        //     let totalValueUSDLocal = checkpoint.totalUSDValue
        //     let balancesLocal = checkpoint.balances
        //
        //     //get remote balances
        //     let response = await binance.currentUSDValue()
        //     log.debug(tag,"response: ",response)
        //     let totalValueUSDRemote = response.totalValueUSD
        //     let balancesRemote = response.balances
        //
        //     log.debug(tag,"LOCAL USD value map: ",checkpoint.balanceValuesUSD)
        //     log.debug(tag,"REMOTE USD value map: ",response.valueUSDMap)
        //     views.displayJsonToChannel(response.valueUSDMap,'help')
        //     views.displayJsonToChannel(checkpoint.balanceValuesUSD,'help')
        //
        //     log.debug(tag,"totalValueUSDLocal: ",totalValueUSDLocal)
        //     //log.debug(tag,"balancesLocal: ",balancesLocal)
        //     log.debug(tag,"totalValueUSDRemote: ",totalValueUSDRemote)
        //     //log.debug(tag,"balancesRemote: ",balancesRemote)
        //
        //
        //     //find differences
        //     let balanceDiffs = await diffTool(balancesLocal,balancesRemote)
        //     log.debug(tag,"diff: ",balanceDiffs)
        //     log.debug(tag,"diff: ",balanceDiffs['BTC'])
        //     log.debug(tag,"diff: ",balanceDiffs['BCC'])
        //     log.debug(tag,"diff: ",balanceDiffs['ETH'])
        //     //get usd value
        //
        //     //if within tolerance
        //     let diff = Math.floor((totalValueUSDLocal / totalValueUSDRemote) * 100)
        //     log.debug(tag,"diff: ",diff)
        //
        //     if(diff < 1){
        //         successStart = true
        //         views.displayStringToChannel(":on: successfull start! within 1pct USD diff Remote: "+totalValueUSDRemote+" local: "+totalValueUSDLocal,'help')
        //     } else {
        //
        //         views.displayStringToChannel("Total reported USD from binance: "+totalValueUSDRemote + " local Audit:  "+totalValueUSDLocal,'help')
        //         views.displayStringToChannel(JSON.stringify(response.valueUSDMap),'help')
        //         views.displayStringToChannel(JSON.stringify(checkpoint.valueUSDMap),'help')
        //         throw Error("666 Failed to audit! data inconsistant. ><>--< :skull:  spooky trumpet :trumpet: ")
        //     }
        // }
        //
        //
        // if(successStart){
        //     let body = ":on_button: STARTUP successfull Audit matched reported!"
        //     //let body = ":on_button: STARTUP successfull Audit matched reported! credits:"+creditsAll.length+" debits:"+debitsAll.length+" :binance:  startup balances: "+balances.BTC+" (:BTC:) ("+(await get_value(balances.BTC,"BTC")).toFixed(2)+"(USD))  "+balances.LTC+" (:LTC:) ("+(await get_value(balances.LTC,"LTC")).toFixed(2)+"(USD))"
        //     log.info(tag,"startup: ",body)
        //     views.displayStringToChannel(body,'help')
        // } else {
        //     views.displayStringToChannel("failed to start! :fail: ",'help')
        // }

        return true
    } catch (e) {
        //If unable to start, begin audit
        //rebuild_exchange_history()
        console.error(tag, 'ERROR: ', e)
        throw e
    }
}

// let reset_database = async function () {
//     let tag = TAG + ' | rebuild_exchange_history | '
//     try {
//         //del redis sets
//         await redis.del("tradesProcessed")
//         await redis.del("transfersProcessed")
//
//         //TODO backup before dropping
//         //drop mongo tables
//         // await credits.drop()
//         // await debits.drop()
//         // await trades.drop()
//         // await reportLA.drop()
//
//         return true
//     } catch (e) {
//         console.error(tag, 'ERROR: ', e)
//         throw 'ERROR:BALANCE:100 failed to find balance'
//     }
// }
//
// //rescan exchange infos and audit
// let rebuild_exchange_history = async function () {
//     let tag = TAG + ' | rebuild_exchange_history | '
//     try {
//         //await reset_database()
//
//
//         //TODO for each exchange
//
//         //get all trades
//         let allTrades = await mongo['binance-trades'].find({},{sort:-1})
//         log.info(tag,"allTrades: ",allTrades.length)
//         views.displayStringToChannel("found local collection of trades count: "+allTrades.length,'help')
//         log.debug(tag,"allTrades: ",allTrades)
//         //let allTrades = []
//
//         //get all transfers
//         let allTransfers = await mongo['binance-transfers'].find({},{sort:-1})
//         log.info(tag,"allTransfers: ",allTransfers.length)
//         views.displayStringToChannel("found local collection of transfers count: "+allTransfers.length,'help')
//         log.debug(tag,"allTransfers: ",allTransfers)
//
//         if(allTransfers.length === 0){
//             //get all coins
//             let allCoins = await binance.coins()
//             log.debug(tag,"allCoins: ",allCoins)
//             log.info(tag,"allCoins: ",allCoins.length)
//             views.displayStringToChannel("Auditing coins found (binance) allCoins: "+allCoins.length,'help')
//
//             //HACK (I know I only transferd BTC) get all transfers
//             await audit_all_transfers(['BTC','LTC','ETH','BCC','ENJ'])
//         }
//         if(allTrades.length === 0){
//             //get all coins
//             let allMarkets = await binance.markets()
//             log.info(tag,"allMarkets: ",allMarkets.length)
//             log.debug(tag,"allMarkets: ",allMarkets)
//
//             await audit_all_trades(allMarkets)
//         }
//
//         if(allTrades.length > 0 && allTransfers.length > 0){
//             //combine
//             let allTX = _.concat(allTrades, allTransfers)
//             log.info(tag,"allTX: ",allTX.length)
//
//             allTX = allTX.sort((a, b) => {
//                 return a['time'] > b['time'];
//             });
//
//             log.info(tag,"(sorted) allTX: ",allTX.length)
//
//             //RULE: chronologically enforced accounting
//
//             for(let i = 0;i < allTX.length;i++){
//                 let tx = allTX[i]
//                 log.debug(tag,"tx: ",tx)
//
//                 if(!tx.time){
//                     tx.transfer = true
//                     tx.time = tx.insertTime
//                     tx.coin = tx.asset
//                 }
//                 if(tx.txId) tx.txid = tx.txId
//                 if(tx.id) tx.txid = tx.id
//                 //push to mongo
//
//                 //indexed on txid
//
//
//                 let saveResult = await mongo['binance-txs'].insert(tx)
//                 log.info(tag,"saveResult: ",saveResult)
//             }
//         } else {
//             throw Error("rebuilding history... try again later")
//         }
//
//
//         return true
//     } catch (e) {
//         console.error(tag, 'ERROR: ', e)
//         throw Error('100: failed to rebuild_exchange_history')
//     }
// }
//
// let get_balance = async function (exchange) {
//     let tag = TAG + ' | balance | '
//     try {
//
//         //
//         let balance = await binance.balances()
//
//         //
//
//         return balance
//     } catch (e) {
//         console.error(tag, 'ERROR: ', e)
//         throw 'ERROR:BALANCE:100 failed to find balance'
//     }
// }
//
// let get_usd_value = async function (exchange) {
//     let tag = TAG + ' | balance | '
//     try {
//
//         //
//         let balance = await binance.currentUSDValue()
//
//         //
//
//         return balance
//     } catch (e) {
//         console.error(tag, 'ERROR: ', e)
//         throw 'ERROR:BALANCE:100 failed to find balance'
//     }
// }
//
//
//
// /**************************************
//  // audit
//  //*************************************/
//
// let audit_all_trades = async function(markets){
//     try{
//         for(let i = 0; i < markets.length;i++) {
//             let market = markets[i]
//             audit_trades(market)
//             views.displayStringToChannel("Auditing Market: "+market,'help')
//             await pause(1)
//         }
//     }catch(e){
//         console.error(e)
//     }
// }
//
// let audit_all_transfers = async function(allCoins){
//     let tag = TAG+" | audit_all_transfers | "
//     try{
//         for(let i = 0; i < allCoins.length;i++) {
//             let coin = allCoins[i]
//             views.displayStringToChannel("Auditing coin transfers: "+coin,'help')
//             audit_transfers(coin)
//             await pause(1)
//         }
//     }catch(e){
//         console.error(e)
//         throw e
//     }
// }
//
// let audit_trades = async function(market){
//     let tag = TAG+" | audit_all_transfers | "
//     try{
//         log.debug(tag,"market: ",market)
//
//         //get all trades
//         let trades = await binance.tradeHisory(market)
//         log.debug(tag,"trades: ",trades)
//         if(trades.length > 1) views.displayStringToChannel("trades found on market: "+market+"  count:"+trades.length,'help')
//         for(let i = 0; i < trades.length;i++){
//             let trade = trades[i]
//             log.debug(tag,"trade: ",trade)
//             //save to mongo
//             mongo['binance-trades'].insert(trade)
//
//             //add to queue
//             let isPushed = await redis.lpush('queue:trades:audit',JSON.stringify(trade))
//             log.debug(tag,"isPushed",isPushed)
//         }
//     }catch(e){
//         console.error(e)
//     }
// }
//
// let audit_transfers = async function(coin){
//     let tag = TAG+" | audit_transfers | "
//     try{
//         let transfers = await binance.transferHistory(coin)
//         log.info(tag,"transfers: ",transfers)
//         transfers = transfers.depositList
//         log.debug(tag,"transfers: ",transfers)
//         for(let i = 0; i < transfers.length;i++){
//             let transfer = transfers[i]
//             log.debug(tag,"transfer: ",transfer)
//             views.displayStringToChannel("transfer found: "+transfer.txId,'help')
//             //save to mongo
//             mongo['binance-transfers'].insert(transfer)
//
//             //add to queue
//             let isPushed = await redis.lpush('queue:transfers:audit',JSON.stringify(transfer))
//             log.debug(tag,"isPushed",isPushed)
//         }
//
//     }catch(e){
//         console.error(e)
//     }
// }
//
// let get_value = async function(amount,coin){
//
//     try{
//         coin = coin.toUpperCase()
//         let rateBTC = await redis.hget("rates",coin)
//         //console.log(rateBTC)
//
//         return amount / (1/ rateBTC)
//     }catch(e){
//         console.error(e)
//     }
// }
//
// /**************************************
//  // lib
//  //*************************************/
//
// function toFixed(num, fixed) {
//     var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
//     return num.toString().match(re)[0];
// }
//
// let diffTool = function(balancesLocal,balancesRemote){
//     let tag = TAG + " | diffToll | "
//     let longest
//     let longestKeys
//     let keysLocal = Object.keys(balancesRemote)
//     let keysRemote = Object.keys(balancesLocal)
//     if(keysLocal.length > keysRemote.length){
//         longest = balancesRemote
//         longestKeys = keysLocal
//     } else {
//         longest = balancesRemote
//         longestKeys = keysRemote
//     }
//     let output = {}
//     //iterate over longest
//     for(let i = 0; i < longestKeys.length; i++){
//         let asset = longestKeys[i]
//         if(!balancesLocal[asset]) balancesLocal[asset] = 0
//         if(!balancesRemote[asset]) balancesRemote[asset] = 0
//
//         let roundedLocal  = toFixed(balancesLocal[asset],6)
//         let roundedRemote = toFixed(balancesRemote[asset],6)
//         log.info(tag,asset,"roundedLocal: ",roundedLocal)
//         log.info(tag,asset,"balancesRemote: ",balancesRemote)
//
//         //trim to 7~ decimicals to compare
//         //TODO take this to 8 baby every satoshi accounted for
//         if(roundedLocal === roundedRemote){
//             output[asset] = "WINNING!!! MATCH!"
//         } else {
//             let diff = {
//                 remote:balancesRemote[asset],
//                 local:balancesLocal[asset],
//                 diff:balancesRemote[asset] - balancesLocal[asset]
//             }
//             output[asset] = diff
//         }
//
//     }
//     return output
// }
//
//
// const pause = function(length){
//     return new Promise(function(resolve, reject) {
//         var done = function(){resolve(true)}
//         setTimeout(done,length*1000)
//     })
// }



