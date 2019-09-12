/*
    Fomobot Core Class
        Highlander

 */

const TAG  = " | FOMOBOT | "
let VERSION = 0.01

//import {train,init} from "./train"
//let train = require("./train")
import { BitmexAPI } from "bitmex-node";
import log from './logger'
import {getConfig} from './config'

const moment = require('moment');
const Cryptr = require('cryptr');
const db = require('monk')('localhost/zenbot4')
const tradesDB = db.get('trades')

let IS_INIT = false

let EXCHANGES = {}
let BALANCES = []

class BotService {

    static getVersion(){
        return VERSION
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
                let pub = config.bitmexTestPub

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
                let wallet = await bitmex.User.getWallet()
                log.debug("wallet: ", wallet)
                IS_INIT = true
            }

            return true
        }catch(e){
            console.error(tag,e)
            throw e
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

    static async getSummaryInfo() {
        let output = {
            online:IS_INIT,
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
