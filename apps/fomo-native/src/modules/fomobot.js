/*
    Fomobot native bot Class

        Highlander


positions:  [ { account: 199232,
      avgCostPrice: 9231,
      avgEntryPrice: 9231,
      bankruptPrice: 8787.5,
      breakEvenPrice: 9231.5,
      commission: 0.00075,
      crossMargin: true,
      currency: 'XBt',
      currentComm: -8398,
      currentCost: -21666000,
      currentQty: 2000,
      currentTimestamp: '2019-11-03T23:53:10.381Z',
      deleveragePercentile: 1,
      execBuyCost: 0,
      execBuyQty: 0,
      execComm: 0,
      execCost: 0,
      execQty: 0,
      execSellCost: 0,
      execSellQty: 0,
      foreignNotional: -2000,
      grossExecCost: 0,
      grossOpenCost: 0,
      grossOpenPremium: 0,
      homeNotional: 0.21724,
      indicativeTax: 0,
      indicativeTaxRate: null,
      initMargin: 0,
      initMarginReq: 0.01,
      isOpen: true,
      lastPrice: 9206.58,
      lastValue: -21724000,
      leverage: 100,
      liquidationPrice: 8830.5,
      longBankrupt: 0,
      maintMargin: 233116,
      maintMarginReq: 0.005,
      marginCallPrice: 8830.5,
      markPrice: 9206.58,
      markValue: -21724000,
      openOrderBuyCost: 0,
      openOrderBuyPremium: 0,
      openOrderBuyQty: 0,
      openOrderSellCost: 0,
      openOrderSellPremium: 0,
      openOrderSellQty: 0,
      openingComm: -8398,
      openingCost: -21666000,
      openingQty: 2000,
      openingTimestamp: '2019-11-03T23:00:00.000Z',
      posAllowance: 0,
      posComm: 16456,
      posCost: -21666000,
      posCost2: -21665945,
      posCross: 58055,
      posInit: 216660,
      posLoss: 55,
      posMaint: 126368,
      posMargin: 291116,
      posState: '',
      prevClosePrice: 9214.65,
      prevRealisedPnl: 0,
      prevUnrealisedPnl: 0,
      quoteCurrency: 'USD',
      realisedCost: 0,
      realisedGrossPnl: 0,
      realisedPnl: 8398,
      realisedTax: 0,
      rebalancedPnl: -8080,
      riskLimit: 20000000000,
      riskValue: 21724000,
      sessionMargin: 0,
      shortBankrupt: 0,
      simpleCost: null,
      simplePnl: null,
      simplePnlPcnt: null,
      simpleQty: null,
      simpleValue: null,
      symbol: 'XBTUSD',
      targetExcessMargin: 0,
      taxBase: 0,
      taxableMargin: 0,
      timestamp: '2019-11-03T23:53:10.381Z',
      underlying: 'XBT',
      unrealisedCost: -21666000,
      unrealisedGrossPnl: -58000,
      unrealisedPnl: -58000,
      unrealisedPnlPcnt: -0.0027,
      unrealisedRoePcnt: -0.2677,
      unrealisedTax: 0,
      varMargin: 0 } ]


 */

const TAG  = " | FOMOBOT | "
let VERSION = 0.01

//import {train,init} from "./train"
//let train = require("./train")
import log from './logger'
import {getConfig} from './config'
import {messageBus} from '@/messagebus'

let {BitmexAPI,BitmexSocket} = require("bitmex-node");
//const BitMEXClient = require('@fomobro/bitmex-realtime-api-native');
//const client = new BitMEXClient();
const moment = require('moment');
const Cryptr = require('cryptr');
const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')


let IS_INIT = false

let EXCHANGES = {}
let BALANCES = []
let API_KEY_PUBLIC
let API_KEY_PRIVATE

let IS_PAPER = false
let IS_TESTNET = true

//let position

let POSITIONS = []

let LAST_PRICE = 0
let IS_BULL = false
let IS_BEAR = false
let PCT_IN_POSITION = 0
let BALANCE_POSITION = 0
let POSITION_NATIVE = 0
let BALANCE_AVAILABLE = 0

let POSITION_PNL = 0

class BotService {

    static getVersion(){
        return VERSION
    }

    static getApiKeys(){
        return {public:API_KEY_PUBLIC,private:API_KEY_PRIVATE}
    }

    static async initClient(password) {
        let tag = TAG + " | initClient | "
        try{
            if(!IS_INIT){
                let config = getConfig()
                if(!config.bitmexTest) throw Error("Bitmex not configured!")
                if(!password) throw Error("Password required!")

                //decrypt priv
                let encryptedPriv = config.bitMexTestPriv
                const cryptr = new Cryptr(password);
                let priv = cryptr.decrypt(encryptedPriv)
                let pub = config.bitMexTestPub

                log.debug("pub: ",pub)
                log.debug("priv: ",priv)

                //
                if(!pub) throw Error("missing pub! ")
                if(!priv) throw Error("missing priv! ")

                EXCHANGES['bitmex'] = new BitmexAPI({
                    "apiKeyID": pub,
                    "apiKeySecret": priv,
                    "testnet":true
                    // "proxy": "https://cors-anywhere.herokuapp.com/"
                })

                //get balances
                let wallet = await EXCHANGES['bitmex'].User.getWallet()
                log.debug("wallet: ", wallet)

                let balance = wallet.amount
                log.info("balance: ",balance)
                BALANCE_AVAILABLE = balance  / 100000000


                let positions = await EXCHANGES['bitmex'].Position.get()
                log.info("positions: ",positions)
                POSITIONS  = positions

                //calculate globals?
                for(let i = 0; i < positions.length; i++){
                    let position = positions[i]

                    BALANCE_POSITION = BALANCE_POSITION + Math.abs(position.lastValue) / 100000000

                    POSITION_NATIVE = position.currentQty

                    //percent IN
                    let pctAvaible = balance / Math.abs(BALANCE_POSITION)
                    pctAvaible = pctAvaible * 100
                    pctAvaible = pctAvaible - 100
                    PCT_IN_POSITION = pctAvaible
                    log.info("pctInPosition: ",pctAvaible)

                    LAST_PRICE =position.lastPrice

                    //isBull
                    let isBull = false
                    if(positions[0].currentQty > 0){
                        isBull = true
                        IS_BULL = true
                    }

                    //isBear
                    let isBear = false
                    if(positions[0].currentQty < 0){
                        isBear = true
                        IS_BEAR = true
                    }

                    IS_INIT = true
                }

            }

            return true
        }catch(e){
            console.error(tag,e)
            throw e
        }
    }

    static async updatePosition() {
        try{

            let wallet = await EXCHANGES['bitmex'].User.getWallet()
            log.debug("wallet: ", wallet)

            let balance = wallet.amount
            log.info("balance: ",balance)
            BALANCE_AVAILABLE = balance  / 100000000


            let positions = await EXCHANGES['bitmex'].Position.get()
            log.info("positions: ",positions)

            for(let i = 0; i < positions.length; i++){
                let position = positions[i]
                BALANCE_POSITION = BALANCE_POSITION + Math.abs(position.lastValue) / 100000000

                POSITION_PNL = positions[0].unrealisedGrossPnl

                //percent IN
                let pctAvaible = balance / Math.abs(BALANCE_POSITION)
                pctAvaible = pctAvaible * 100
                pctAvaible = pctAvaible - 100
                PCT_IN_POSITION = pctAvaible
                log.info("pctInPosition: ",pctAvaible)

                //isBull
                let isBull = false
                if(positions[0].lastValue > 0){
                    isBull = true
                    IS_BULL = true
                }

                //isBear
                let isBear = false
                if(positions[0].lastValue < 0){
                    isBear = true
                    IS_BEAR = true
                }

            }


        }catch(e){
            console.error("e: ",e)
        }
    }

    static async buySignal() {
        let tag = TAG+ " | buySignal | "
        try{
            await this.updatePosition()
            //
            if(IS_BEAR || !IS_BULL){
                //go bull

                //get position

                //amount = position X 2
                let amount =  Math.abs(POSITION_NATIVE) * 2
                if(!amount || amount < 0) amount = 1000
                log.info(tag,"amount: ",amount)


                log.info(tag,"LAST_PRICE: ",LAST_PRICE)
                let price = LAST_PRICE + (LAST_PRICE * 0.01)
                price = price.toFixed(0)
                log.info(tag,"price: ",price)

                let result = await EXCHANGES['bitmex'].Order.new({symbol:"XBTUSD",orderQty:amount,price:price,leverage:"10"})
                log.info("result: ",result)
                messageBus.$emit('execution',result)


                IS_BULL = true
                IS_BEAR = false
            }


        }catch(e){
            console.error("e: ",e)
        }
    }

    static async sellSignal() {
        let tag = TAG+ " | sellSignal | "
        try{
            log.info(tag,"Sell signal!")
            await this.updatePosition()
            //
            if(IS_BULL || !IS_BEAR){
                //go bull


                let amount =  Math.abs(POSITION_NATIVE) * 2
                if(!amount || amount < 0) amount = 1000

                log.info(tag,"amount: ",amount)
                amount = amount * -1

                log.info(tag,"LAST_PRICE: ",LAST_PRICE)
                let price = LAST_PRICE - (LAST_PRICE * 0.01)
                price = price.toFixed(0)
                log.info(tag,"price: ",price)

                let result = await EXCHANGES['bitmex'].Order.new({symbol:"XBTUSD",orderQty:amount,price:price,leverage:"10"})
                log.info("result: ",result)
                messageBus.$emit('execution',result)


                IS_BULL = true
                IS_BEAR = false
            }


        }catch(e){
            console.error("e: ",e)
        }
    }

    static async getBackfillStatus() {
        try{
            let output = {}
            let count = await tradesDB.count()
            output.count = count

            //get oldest
            let oldest = await tradesDB.findOne({},{limit:1,sort:{time:1}})
            output.oldest = moment(oldest.time).calendar()
            //
            // //get newest
            let newest = await tradesDB.findOne({},{limit:1,sort:{time:-1}})
            output.newest = moment(newest.time).calendar()

            return output
        }catch(e){
            console.error("e: ",e)
        }
    }


    static async getBackfillChart() {

        // let allTrades = await tradesDB.aggregate({$sample: { size: 300 }},{$sort:{time:-1}})
        // console.log("allTrades: ",allTrades.length)

        let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"})
        console.log("allTrades: ",allTrades.length)

        let lineChartData = []
        for(let i = 0; i < allTrades.length; i++){
            let trade = allTrades[i]
            let entry = {}
            entry.value = []
            entry.value.push(trade.time)
            entry.value.push(trade.price)
            lineChartData.push(entry)
        }

        //get all trades

        //place them into candles

        let candleSticks = [
            {
                "value":[
                    1566858239999,
                    10159.68,
                    10156.01,
                    10156,
                    10160.01
                ]
            },
            {
                "value":[
                    1566858119999,
                    10154,
                    10159.68,
                    10154,
                    10159.93
                ]
            },
            {
                "value":[
                    1566857999999,
                    10154,
                    10154,
                    10153.99,
                    10154
                ]
            },
            {
                "value":[
                    1566857879999,
                    10154.35,
                    10153.99,
                    10153.51,
                    10154.35
                ]
            },
            {
                "value":[
                    1566857759999,
                    10163.45,
                    10153.48,
                    10152.37,
                    10164.99
                ]
            },
            {
                "value":[
                    1566857639999,
                    10167.45,
                    10163.43,
                    10161.56,
                    10167.45
                ]
            },
            {
                "value":[
                    1566857519999,
                    10168.01,
                    10167.45,
                    10167,
                    10173.11
                ]
            },
            {
                "value":[
                    1566857399999,
                    10160,
                    10167.82,
                    10159.58,
                    10169.39
                ]
            }
        ]

        // let lineChartData = [
        //         {
        //         "value":[
        //             1566845762683,
        //             10333.24
        //         ]
        //         },
        //         {
        //             "value":[
        //                 1566845764860,
        //                 10333.24
        //             ]
        //         },
        //         {
        //             "value":[
        //                 1566845769880,
        //                 10335.71
        //             ]
        //         },
        //         {
        //             "value":[
        //                 1566845778720,
        //                 10335.71
        //             ]
        //         },
        //         {
        //             "value":[
        //                 1566845779303,
        //                 10335.71
        //             ]
        //         },
        //         {
        //             "value":[
        //                 1566845783628,
        //                 10335.71
        //             ]
        //         },
        //         {
        //             "value":[
        //                 1566845784222,
        //                 10335.62
        //             ]
        //         }
        //     ]

        let trade_chart = {
            "useUTC":true,
            "grid":{
                "left":60,
                "right":60
            },
            "xAxis":[
                {
                    "type":"time",
                    "axisLabel":{

                    }
                }
            ],
            "yAxis":[
                {
                    "name":"Price",
                    "position":"right",
                    "scale":true
                },
                {
                    "name":"Volume",
                    "scale":true
                }
            ],
            "toolbox":{
                "show":true,
                "showTitle":false,
                "feature":{
                    "dataZoom":{

                    },
                    "restore":{

                    },
                    "saveAsImage":{

                    }
                }
            },
            "tooltip":{
                "trigger":"axis",
                "axisPointer":{
                    "type":"cross"
                }
            },
            "dataZoom":[
                {
                    "startValue":1566857220868
                },
                {
                    "type":"inside"
                }
            ],
            "series":[
                {
                    "name":"Price",
                    "type":"line",
                    "data":lineChartData
                },
                // {
                //     "name":"Volume",
                //     "type":"bar",
                //     "yAxisIndex":1,
                //     "z":1,
                //     "itemStyle":{
                //         "opacity":0.25
                //     },
                //     "data":[{
                //         "value":[
                //             1566845762683,
                //             0.02431436
                //         ]
                //     },
                //         {
                //             "value":[
                //                 1566845764860,
                //                 0.0013449
                //             ]
                //         },
                //         {
                //             "value":[
                //                 1566845769880,
                //                 0.00491076
                //             ]
                //         },
                //         {
                //             "value":[
                //                 1566845778720,
                //                 0.00972026
                //             ]
                //         },
                //         {
                //             "value":[
                //                 1566845779303,
                //                 0.00385158
                //             ]
                //         },
                //         {
                //             "value":[
                //                 1566845783628,
                //                 0.01896627
                //             ]
                //         },
                //         {
                //             "value":[
                //                 1566845784222,
                //                 0.00982056
                //             ]
                //         }
                //     ]
                // },
                // {
                //     "name":"High",
                //     "type":"candlestick",
                //     "z":1,
                //     "itemStyle":{
                //         "color":"rgba(40,167,69,0.5)",
                //         "borderColor":"#28a745",
                //         "color0":"rgba(220,53,69,0.5)",
                //         "borderColor0":"#dc3545"
                //     },
                //     "data":candleSticks
                // },
                // {
                //     "type":"line",
                //     "smooth":true,
                //     "lineStyle":{
                //         "type":"dotted"
                //     },
                //     "data":[
                //
                //     ],
                //     "tooltip":{
                //         "show":false
                //     }
                // },
                // {
                //     "name":"Buy",
                //     "type":"scatter",
                //     "symbol":"triangle",
                //     "data":[
                //
                //     ],
                //     "itemStyle":{
                //         "color":"#28a745"
                //     },
                //     "markPoint":{
                //         "symbol":"arrow",
                //         "itemStyle":{
                //             "color":"#28a745"
                //         },
                //         "symbolOffset":[
                //             0,
                //             10
                //         ],
                //         "data":[
                //
                //         ]
                //     }
                // },
                // {
                //     "name":"Sell",
                //     "type":"scatter",
                //     "symbol":"triangle",
                //     "symbolRotate":180,
                //     "data":[
                //
                //     ],
                //     "itemStyle":{
                //         "color":"#dc3545"
                //     },
                //     "markPoint":{
                //         "symbol":"arrow",
                //         "itemStyle":{
                //             "color":"#dc3545"
                //         },
                //         "symbolRotate":180,
                //         "symbolOffset":[
                //             0,
                //             -10
                //         ],
                //         "data":[
                //
                //         ]
                //     }
                // }
            ]
        }

        //set globals?
        return trade_chart
    }

    static async startSockets(strategy) {
        let tag = TAG + " | start bot | "
        try{
            if(!strategy) strategy = "bollinger"


            return true
        }catch(e){
            log.error(tag,e)
        }
    }

    static async getSummaryInfo() {
        let output = {
            online:IS_INIT,
            LAST_PRICE,
            POSITIONS,
            POSITION_PNL,
            BALANCE_POSITION,
            BALANCE_AVAILABLE,
            PCT_IN_POSITION,
            IS_BULL,
            IS_BEAR,
            BALANCES,
        }

        //set globals?
        return output
    }

    static async getAvailableModals() {
        let tag = TAG + " | getAvailableModals | "
        try{

        }catch(e){
            log.error(tag,"e: ",e)
        }
    }

}

export default BotService
