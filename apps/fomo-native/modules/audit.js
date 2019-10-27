
/*
        Financial tools

        Parse and digest 3rd party financial data and expand coverage to meet goals


        Coverage
            Binance:
                deposits
                trades



 */
const TAG = " | financial | "
//const config = require("../configs/env")
let binance = require("./binance-client.js")
//TODO bignum
const log = require('dumb-lumberjack')()
//
const util = require('./redis')
let history = require("./historical-price.js")

const redis = util.redis
const publisher = util.publisher


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

let mongo = require('./mongo')
let views = require('./views')
let signing = require('./signing')

let airdrops = {}

module.exports = {
    auditAccount: function (account) {
        return audit_from_scratch(account);
    },
    auditEvent: function (trade, i, balances, balanceValuesBTC, balanceValuesUSD, prevBlock) {
        return audit_event(trade, i, balances, balanceValuesBTC, balanceValuesUSD, prevBlock);
    },
    digestTrade: function (trade) {
        return digest_trade(trade);
    },
    digestTransfer: function (transfer) {
        return digest_transfer(transfer);
    },
}

/*
    Audit Crypto account
            -highlander

    Completeness:
        ALL tx's

        Notes: For binance that means
            * all airdrops
            * all deposits
            * all withdrawals
            * all trades
            * all fees

   Highlanders Strong accounting
        Nonce on all tx's applied to ledger
        Sign all leger updates
        chain of custody on all audits allowing checkpoints and quick starts against them.



 */

const audit_event = async function(trade, i, balances, balanceValuesBTC, balanceValuesUSD, prevBlock){
    let tag = TAG + " | do_work | "
    try{
        let totalUSDValue = 0
        let totalBTCValue = 0
        log.debug(tag,'trade: ',trade)
        log.debug(tag,'trade: ',trade.time)
        log.debug(tag,'trade: ',typeof(trade.time))
        log.debug(tag,'trade: ',new Date(trade.time).toDateString())
        let time = trade.time
        //rate USD at time of trade
        let rateUSDBTC = await history.bestPrice("BTC",time)
        log.debug(tag,'rateUSDBTC: ',rateUSDBTC)

        let txid
        if(trade.id){
            txid = trade.id
        } else if(trade.txid){
            txid = trade.txid
        }
        log.info(tag,"txid: ",txid)
        let blockTemplate = {
            txid:trade.id,
            txs:[],
            credits:[],
            debits:[],
        }
        blockTemplate.txs.push(trade)
        //let normalizedEvents = normalized

        let credit
        let debit

        if(trade.transfer){
            log.debug(tag,' transfer detected ')

            let credit = trade
            if(!balances[credit.coin]) balances[credit.coin] = 0
            if(!balanceValuesBTC[credit.coin]) balanceValuesBTC[credit.coin] = 0
            if(!balanceValuesUSD[credit.coin]) balanceValuesUSD[credit.coin] = 0

            //TODO FEATURE AIRDROPS if BTC and pre (date) than credit BCC
            // if(credit.coin === "BTC"){
            //     balances['BCC'] = 0
            //     balances['BCC'] = balances['BCC'] + parseFloat(credit.amount)
            //     // 0.184 initial rate (2,415usd)
            //     if(!balanceValuesBTC['BCC']) balanceValuesBTC['BCC'] = 0
            //     if(!balanceValuesUSD['BCC']) balanceValuesUSD['BCC'] = 0
            //     balanceValuesBTC['BCC'] = balanceValuesBTC['BCC'] + parseFloat(credit.amount) * 0.184
            //     balanceValuesUSD['BCC'] = balanceValuesUSD['BCC'] + parseFloat(credit.amount) * 2415
            // }


            if(credit.coin === "BTC"){
                log.info(tag,"(credit) Received deposit: ",credit.amount," ",credit.coin)
                balances[credit.coin] = balances[credit.coin] + parseFloat(credit.amount)
                balanceValuesBTC[credit.coin] = balanceValuesBTC[credit.coin] + parseFloat(credit.amount)
                balanceValuesUSD[credit.coin] = balanceValuesUSD[credit.coin] + parseFloat(credit.amount * rateUSDBTC)
            } else if(credit.coin === "BCC"){
                //TODO HACK we know only one deposit

                let BCCBTCRate = 0.1552
                let valueBTC = parseFloat(credit.amount) * BCCBTCRate
                log.info(tag,"valueBTC: ",valueBTC)
                balances[credit.coin] = balances[credit.coin] + parseFloat(credit.amount)
                balanceValuesBTC[credit.coin] = balanceValuesBTC[credit.coin] + valueBTC
                balanceValuesUSD[credit.coin] = balanceValuesUSD[credit.coin] + parseFloat(valueBTC * rateUSDBTC)

            } else {

                //

                //TODO historical price of more assets
                throw Error('101: unsupported action! need historical data unavailable!')
            }


            blockTemplate.credits.push(credit)
        } else {
            log.debug(tag,' trade detected ')
            let events = await digest_trade(trade)
            log.debug(tag,"events: ",events)
            //credit:
            credit = events.credits[0]
            debit = events.debits[0]

            //
            if(credit) blockTemplate.credits.push(credit)
            if(debit) blockTemplate.debits.push(debit)

            //apply
            if(!balances[credit.coin]) balances[credit.coin] = 0
            if(!balanceValuesBTC[credit.coin]) balanceValuesBTC[credit.coin] = 0
            if(!balanceValuesUSD[credit.coin]) balanceValuesUSD[credit.coin] = 0
            if(!balanceValuesBTC[debit.coin]) balanceValuesBTC[debit.coin] = 0
            if(!balanceValuesUSD[debit.coin]) balanceValuesUSD[debit.coin] = 0


            if(!balances[debit.coin]) {
                log.error(tag,"DEBUG OBJECT: ",{balances,trade,credit,debit})
                throw Error("101: can't debit a coin you do now own!")
            }

            //native value balances
            balances[credit.coin] = balances[credit.coin] + parseFloat(credit.amount)
            balances[debit.coin] = balances[debit.coin] - parseFloat(debit.amount)

            //value BTC
            balanceValuesBTC[credit.coin] = balanceValuesBTC[credit.coin] + parseFloat(credit.valueBTC)
            balanceValuesBTC[debit.coin] = balanceValuesBTC[debit.coin] - parseFloat(debit.valueBTC)

            //value USD
            balanceValuesUSD[credit.coin] = balanceValuesUSD[credit.coin] + parseFloat(credit.valueUSD)
            balanceValuesUSD[debit.coin] = balanceValuesUSD[debit.coin] - parseFloat(debit.valueUSD)

            log.info(tag,"(credit) Acquisition: ",credit.amount," ",credit.coin,"  USD: ",credit.valueUSD)
            log.info(tag,"(debit) Disposial: ",debit.amount," ",debit.coin,"  USD: ",debit.valueUSD)
            log.debug(tag,"Balances:",JSON.stringify(balances))
        }

        log.debug(tag,"balanceValuesBTC: ",balanceValuesBTC)
        log.debug(tag,"balanceValuesUSD: ",balanceValuesUSD)

        // validate block
        // get total assets value USD
        Object.keys(balances).forEach(function(asset) {
            let balance = balances[asset];
            if(!balanceValuesBTC[asset]) {
                log.error(tag,"asset: ",asset)
                //throw Error('103: incomplete data balanceValueBTC')
            }

            totalBTCValue = totalBTCValue + balanceValuesBTC[asset]
            totalUSDValue = totalUSDValue + (balanceValuesBTC[asset] * rateUSDBTC)

            //if any balance is negative THROW
            if(balance < 0) {
                log.error(tag,"DEBUG OBJECT: ",{balances,trade,credit,debit})
                throw Error('102: overdraft!')
            }
        });

        log.info(tag,"totalUSDValue: ",totalUSDValue)

        // stringify blockInfo
        //
        // sign blockInfo
        let block = {
            nonce:i,
            txid,
            time,
            rateUSDBTC,
            balances,
            balanceValuesBTC,
            balanceValuesUSD,
            totalBTCValue,
            totalUSDValue,
            block:blockTemplate,
            prevBlock,
        }

        let signature = await signing.sign(config.AGENT_BTC_MASTER,JSON.stringify(block))
        block.signature = signature
        log.debug(tag,"block: ",block)

        //push to mongo
        let saveResult = await mongo['binance-balances'].insert(block)
        log.debug(tag,"saveResult: ",saveResult)
        return block
    }catch(e){
        views.displayStringToChannel("KILL ALL HUMANS!!! ERROR: "+e.toString(),'help')
        log.error(e)
        throw e
    }
}


const audit_from_scratch = async function(account){
    let tag = TAG + " | do_work | "
    try{

        // TODO select DB based on account
        // All accounts have collection
        // collection is raw tx's
        views.displayStringToChannel("Auditing Binance account! ",'help')

        //get all trades
        let allTxs = await mongo['binance-txs'].find({},{sort:{time:1}})
        if(allTxs.length === 0){
            //
            views.displayStringToChannel('ERROR: you MUST build TX db first!! ')
            throw Error("102: you MUST build tx database first! ")
        }
        views.displayStringToChannel("found TX database entries:  "+allTxs.length,'help')
        log.debug(tag,"allTrades: ",allTxs.length)
        //log.debug(tag,"allTrades: ",allTrades)

        // allTrades = allTrades.sort((a, b) => {
        //     return a['time'] < b['time'];
        // });

        //log.debug(tag,"allTrades: ",allTrades[0])

        //for each
        let prevBlock = "genesis"

        let balances = {}
        let balanceValuesBTC = {}
        let balanceValuesUSD = {}


        let blockchain = []
        //verify ALL have time
        //verify sorted from high to low
        //RULE: chronologically enforced accounting

        //COMPLETENESS: airdrops throw this off
        //MUST find date, MUST credit at correct time (before a sell)


        //Add airdrops
        Object.keys(airdrops).forEach(function(asset) {
            balances[asset] = airdrops[asset];
            balanceValuesBTC[asset] = 0.001
            balanceValuesUSD[asset] = 1
        });

        for(let i = 0;i < allTxs.length;i++){
            let tx = allTxs[i]

            let block = await audit_event(tx, i, balances, balanceValuesBTC, balanceValuesUSD, prevBlock)

            blockchain.push(block)
        }
        log.debug(tag,"blockchain: ",blockchain)




        return blockchain[blockchain.length - 1]
    }catch(e){
        views.displayStringToChannel("KILL ALL HUMANS!!! ERROR: "+e.toString(),'help')
        log.error(tag, e)
        throw e
    }
}

const digest_transfer = async function(transfer){
    let tag = TAG + " | digest_transfer | "
    try{

        let credit = transfer
        credit.exchange = 'binance'
        credit.transfer = true
        credit.time = transfer.insertTime
        credit.coin = transfer.asset

        return {credits:[credit],debits:[]}
    }catch(e){
        log.error(e)
    }
}

const digest_trade = async function(trade){
    let tag = TAG + " | digest_trade | "
    try{

        //market info
        let marketInfo = await redis.hget('binance:markets',trade.symbol)
        if(!marketInfo) {
            let marketInfoAll = await binance.markets()
            marketInfo = await redis.hget('binance:markets', trade.symbol)
        }
        marketInfo = JSON.parse(marketInfo)

        log.debug(tag,'marketInfo: ',marketInfo)

        //rate USD at time of trade
        let rateUSDBTC = await history.bestPrice("BTC",trade.time)
        log.debug(tag,'rateUSDBTC: ',rateUSDBTC)

        let credit = {}
        let debit = {}

        credit.id = trade.id
        debit.id = trade.id

        credit.time = trade.time
        debit.time = trade.time

        credit.tradeId = trade.orderId
        debit.tradeId = trade.orderId



        //TODO multi-asset handle
        if(trade.isBuyer){
            log.info("IsBuyer acquiring quote disposing base")
            credit.coin = marketInfo.baseAsset
            debit.coin = marketInfo.quoteAsset

            let amountQUOTE = trade.qty / (1/trade.price)
            log.debug(tag,"amountQUOTE: ",amountQUOTE)

            let amountBASE = trade.qty - trade.commission
            log.debug(tag,"amountBASE: ",amountBASE)

            credit.amount = amountBASE
            credit.valueUSD = amountQUOTE * rateUSDBTC
            credit.valueBTC = amountQUOTE

            debit.amount = amountQUOTE
            debit.valueBTC = amountBASE * trade.price
            debit.valueUSD = debit.valueBTC * rateUSDBTC

        }else{
            log.info("IsSeller acquiring quote disposing base")
            credit.coin = marketInfo.quoteAsset
            debit.coin = marketInfo.baseAsset

            let amountQUOTE = trade.qty / (1/trade.price)
            log.debug(tag,"amountQUOTE: ",amountQUOTE)

            let amountBASE = trade.qty - trade.commission
            log.debug(tag,"amountBASE: ",amountBASE)

            credit.amount = amountQUOTE
            credit.valueBTC = amountBASE * trade.price
            credit.valueUSD = credit.valueBTC * rateUSDBTC

            debit.amount = amountBASE
            debit.valueBTC = amountQUOTE
            debit.valueUSD = amountQUOTE * rateUSDBTC
        }


        credit.account = "master:binance"
        debit.account  = "master:binance"


        return {credits:[credit],debits:[debit]}
    }catch(e){
        log.error(e)
    }
}
