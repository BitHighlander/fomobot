/**
 * Fomobot Native Bot Class
 *
 * @Author Highlander (GitHub: BitHighlander)
 */
const TAG = " | FOMOBOT | "
let VERSION = 0.01

//import {train,init} from "./train"
//let train = require("./train")
import log from './logger'
import {getConfig} from './config'
import {messageBus} from '@/messagebus'

let {BitmexAPI, BitmexSocket} = require("bitmex-node");

let bot = require("@fomobro/fomobot")
const moment = require('moment');
const Cryptr = require('cryptr');
const db = require('monk')('localhost/zenbot4');
const tradesDB = db.get('trades');

let IS_BEAR = false;
let IS_BULL = false;
let IS_INIT = false;
let IS_PAPER = false;
let IS_TESTNET = true;

let API_KEY_PRIVATE;
let API_KEY_PUBLIC;
let BALANCE_AVAILABLE = 0;
let BALANCE_POSITION = 0;
let BALANCES = [];
let EXCHANGES = {};
let LAST_PRICE = 0;
let PCT_IN_POSITION = 0;
let POSITIONS = [];
let POSITION_NATIVE = 0;
let POSITION_PNL = 0;

class BotService {

    static getVersion() {
        return VERSION
    }

    static getApiKeys() {
        return {
            public: API_KEY_PUBLIC,
            private: API_KEY_PRIVATE
        }
    }

    static async initClient(password, config) {
        let tag = TAG + " | initClient | "
        try {
            if (!IS_INIT) {
                if (!config) {
                    config = getConfig()
                }

                //if(!config.bitmexTest) throw Error("Bitmex not configured!")
                if (!password) throw Error("Password required!");
                let encryptedPriv = config.bitMexTestPriv;
                const cryptr = new Cryptr(password);
                let priv = cryptr.decrypt(encryptedPriv)
                let pub = config.bitMexTestPub

                log.debug("pub: ", pub)
                log.debug("priv: ", priv)

                if (!pub) throw Error("missing pub! ")
                if (!priv) throw Error("missing priv! ")

                EXCHANGES['bitmex'] = new BitmexAPI({
                    "apiKeyID": pub,
                    "apiKeySecret": priv,
                    "testnet": true
                    // "proxy": "https://cors-anywhere.herokuapp.com/"
                })

                let wallet = await EXCHANGES['bitmex'].User.getWallet()
                log.debug("initClient() | wallet: ", wallet)

                let balance = wallet.amount
                log.info("initClient() | balance: ", balance)
                BALANCE_AVAILABLE = balance / 100000000

                let positions = await EXCHANGES['bitmex'].Position.get()
                log.info("initClient() | positions: ", positions)
                POSITIONS = positions

                // Calculate Last Price (BTC_USD)
                let trades = await EXCHANGES['bitmex'].Trade.get({symbol: "XBTUSD", count: "1", reverse: true})
                LAST_PRICE = trades[0].price
                console.log("initClient() | Last Price (BTC_USD):", LAST_PRICE)

                //calculate globals?
                for (let i = 0; i < positions.length; i++) {
                    let position = positions[i]

                    BALANCE_POSITION = BALANCE_POSITION + Math.abs(position.lastValue) / 100000000

                    POSITION_NATIVE = position.currentQty

                    //percent IN
                    let pctAvaible = balance / Math.abs(BALANCE_POSITION)
                    pctAvaible = pctAvaible * 100
                    pctAvaible = pctAvaible - 100
                    PCT_IN_POSITION = pctAvaible
                    log.info("initClient() | pctInPosition: ", pctAvaible)

                    //LAST_PRICE = position.lastPrice

                    //isBull
                    let isBull = false
                    if (positions[0].currentQty > 0) {
                        isBull = true
                        IS_BULL = true
                    }

                    //isBear
                    let isBear = false
                    if (positions[0].currentQty < 0) {
                        isBear = true
                        IS_BEAR = true
                    }

                    IS_INIT = true
                }
            }

            return true
        } catch (e) {
            console.error(tag, e)
            throw e
        }
    }

    static async updatePosition() {
        try {
            const client = EXCHANGES['bitmex']

            let wallet = await client.User.getWallet()
            log.debug("updatePosition() | wallet: ", wallet)

            let balance = wallet.amount
            log.info("updatePosition() | balance: ", balance)
            BALANCE_AVAILABLE = balance / 100000000

            let positions = await client.Position.get()
            log.info("updatePosition() | positions: ", positions)

            for (let i = 0; i < positions.length; i++) {
                let position = positions[i]
                BALANCE_POSITION = BALANCE_POSITION + Math.abs(position.lastValue) / 100000000

                POSITION_PNL = positions[0].unrealisedGrossPnl

                //percent IN
                let pctAvaible = balance / Math.abs(BALANCE_POSITION)
                pctAvaible = pctAvaible * 100
                pctAvaible = pctAvaible - 100
                PCT_IN_POSITION = pctAvaible
                log.info("updatePosition() | pctInPosition: ", pctAvaible)

                //isBull
                let isBull = false
                if (positions[0].lastValue > 0) {
                    isBull = true
                    IS_BULL = true
                }

                //isBear
                let isBear = false
                if (positions[0].lastValue < 0) {
                    isBear = true
                    IS_BEAR = true
                }
            }
        } catch (e) {
            console.error("e: ", e)
        }
    }

    static async buySignal(contractPrincipleUsd = 5000) {
        let tag = TAG + " | buySignal | "
        try {
            await this.updatePosition()
            //
            if (IS_BEAR || !IS_BULL) {
                //go bull

                //get position

                //amount = position X 2
                let amount = Math.abs(POSITION_NATIVE) * 2
                if (!amount || amount < 0) amount = contractPrincipleUsd = 5000
                log.info(tag, "amount: ", amount)


                log.info(tag, "LAST_PRICE: ", LAST_PRICE)
                let price = LAST_PRICE + (LAST_PRICE * 0.01)
                price = price.toFixed(0)
                log.info(tag, "price: ", price)

                let result = await EXCHANGES['bitmex'].Order.new({
                    symbol: "XBTUSD",
                    orderQty: amount,
                    price: price,
                    leverage: 5
                })
                log.info("result: ", result)
                messageBus.$emit('execution', result)


                IS_BULL = true
                IS_BEAR = false
            }


        } catch (e) {
            console.error("e: ", e)
        }
    }

    static async sellSignal(contractPrincipleUsd = 5000) {
        let tag = TAG + " | sellSignal | "
        try {
            log.info(tag, "Sell signal!")
            await this.updatePosition()
            //
            if (IS_BULL || !IS_BEAR) {
                //go bull


                let amount = Math.abs(POSITION_NATIVE)
                if (!amount || amount < 0) amount = contractPrincipleUsd

                log.info(tag, "amount: ", amount)
                amount = amount * -1

                log.info(tag, "LAST_PRICE: ", LAST_PRICE)
                let price = LAST_PRICE - (LAST_PRICE * 0.01)
                price = price.toFixed(0)
                log.info(tag, "price: ", price)

                let result = await EXCHANGES['bitmex'].Order.new({
                    symbol: "XBTUSD",
                    orderQty: amount,
                    price: price,
                    leverage: "5"
                })
                log.info("result: ", result)
                messageBus.$emit('execution', result)


                IS_BULL = true
                IS_BEAR = false
            }


        } catch (e) {
            console.error("e: ", e)
        }
    }

    static async getBackfillStatus() {
        try {
            let output = {}
            let count = await tradesDB.count()
            output.count = count

            //get oldest
            let oldest = await tradesDB.findOne({}, {limit: 1, sort: {time: 1}})
            output.oldest = moment(oldest.time).calendar()
            //
            // //get newest
            let newest = await tradesDB.findOne({}, {limit: 1, sort: {time: -1}})
            output.newest = moment(newest.time).calendar()

            return output
        } catch (e) {
            console.error("e: ", e)
        }
    }

    static async getBackfillChart() {

        // let allTrades = await tradesDB.aggregate({$sample: { size: 300 }},{$sort:{time:-1}})
        // console.log("allTrades: ",allTrades.length)

        let allTrades = await tradesDB.find({selector: "bitmex.BTC-USD"})
        console.log("allTrades: ", allTrades.length)

        let lineChartData = []
        for (let i = 0; i < allTrades.length; i++) {
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
                "value": [
                    1566858239999,
                    10159.68,
                    10156.01,
                    10156,
                    10160.01
                ]
            },
            {
                "value": [
                    1566858119999,
                    10154,
                    10159.68,
                    10154,
                    10159.93
                ]
            },
            {
                "value": [
                    1566857999999,
                    10154,
                    10154,
                    10153.99,
                    10154
                ]
            },
            {
                "value": [
                    1566857879999,
                    10154.35,
                    10153.99,
                    10153.51,
                    10154.35
                ]
            },
            {
                "value": [
                    1566857759999,
                    10163.45,
                    10153.48,
                    10152.37,
                    10164.99
                ]
            },
            {
                "value": [
                    1566857639999,
                    10167.45,
                    10163.43,
                    10161.56,
                    10167.45
                ]
            },
            {
                "value": [
                    1566857519999,
                    10168.01,
                    10167.45,
                    10167,
                    10173.11
                ]
            },
            {
                "value": [
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
            "useUTC": true,
            "grid": {
                "left": 60,
                "right": 60
            },
            "xAxis": [
                {
                    "type": "time",
                    "axisLabel": {}
                }
            ],
            "yAxis": [
                {
                    "name": "Price",
                    "position": "right",
                    "scale": true
                },
                {
                    "name": "Volume",
                    "scale": true
                }
            ],
            "toolbox": {
                "show": true,
                "showTitle": false,
                "feature": {
                    "dataZoom": {},
                    "restore": {},
                    "saveAsImage": {}
                }
            },
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "cross"
                }
            },
            "dataZoom": [
                {
                    "startValue": 1566857220868
                },
                {
                    "type": "inside"
                }
            ],
            "series": [
                {
                    "name": "Price",
                    "type": "line",
                    "data": lineChartData
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
        try {
            if (!strategy) strategy = "bollinger"


            return true
        } catch (e) {
            log.error(tag, e)
        }
    }

    static async getSummaryInfo() {
        let output = {
            online: IS_INIT,
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
        try {

        } catch (e) {
            log.error(tag, "e: ", e)
        }
    }
}

export default BotService
