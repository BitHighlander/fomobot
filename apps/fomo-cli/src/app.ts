/*
      Pioneer APP
 */

const TAG = " | app | ";

import axios from "axios";
import {
    getConfig,
    getWallet, updateConfig,
} from "./modules/config";

let keyTools = require("@fomobro/fomo-wallet")
const Cryptr = require("cryptr");
// const CryptoJS = require("crypto-js");
// const bip39 = require(`bip39`);
//
// const fs = require("fs-extra");
let fomo = require("@fomobro/fomo-api")
const bot = require("@fomobro/fomobot")
const log = require("loggerdog-client")();
const BitMEXClient = require('bitmex-realtime-api');
// let Table = require('cli-table');
// const chalk = require("chalk");
// const figlet = require("figlet");
// const clear = require("clear");
// const request = require('request')
const db = require('monk')('localhost/zenbot4')
const wait = require('wait-promise');
const chalk = require('chalk');
const tradesDB = db.get('trades')
const sleep = wait.sleep;

let USERNAME = ''
let ACCOUNT = ''
let API_KEY = ''
let WALLET_PASSWORD:any = ""
let WALLET_SEED:string
let STRATERGY:string = 'bollinger'
let LAST_PRICE:any
//chingle
// let opts:any = {}
// var player = require('play-sound')(opts = {})

let strategies = [
    'forex_analytics',
    'bollinger',
    'cci_srsi',
    'crossover_vwap',
    'dema',
    'ichimoku_score',
    'ichimoku',
    'speed',
    'wavetrend',
    'trust_distrust',
    'ta_ultosc',
    'stddev',
    'trendline',
    'renko'
]




module.exports = {
    init: function (config: any, wallet: any, password:string) {
        return init_wallet(config,wallet,password);
    },
    setPassword: function (pw: string) {
        WALLET_PASSWORD = pw;
        return true;
    },
    run: async function () {
        onRun()
        return true
    },
    getInfo: async function () {
        return fomo.getInfo()
    },
    goBull: async function () {
        return buy_signal()
    },
    goBear: async function () {
        return sell_signal()
    },
    newUsername: async function (username:string) {
        return change_username(username)
    },
    getApiKeys: async function () {
        return {ACCOUNT,API_KEY}
    },
    signUp: async function () {
        return sign_up()
    },
    lastPrice: async function () {
        return LAST_PRICE
    },
    currentStrategy: async function () {
        return STRATERGY
    },
    strategys: async function () {
        return strategies.toString()
    },
    makePrediction: async function (coin:string,time:string,price:string) {
        return make_prediction(coin,time,price)
    },
    setStrategy: async function (strategy:string) {
        if(strategies.indexOf(strategy) >= 0){
            STRATERGY = strategy
            return strategy
        } else {
            return "unknown strategy "+strategies.toString()
        }
    },
    getConfig: function () {
        return getConfig();
    },
    viewSeed: function () {
        return WALLET_SEED;
    }
};

let sell_signal = async function () {
    let tag = " | sell_signal | ";
    try {
        //predict .001 pct loss in 10min
        log.info(tag,"LAST_PRICE: ",LAST_PRICE)
        let predictPrice = LAST_PRICE - (LAST_PRICE * 0.001)
        let inTenMinutes = new Date().getTime() + (1000 * 60 * 10)
        log.info(tag,"predictPrice: ",predictPrice)

        let result = await make_prediction("BTC",inTenMinutes.toString(),predictPrice.toString())

        return result
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};

let buy_signal = async function () {
    let tag = " | make_prediction | ";
    try {
        //predict .001 pct loss in 10min
        log.info(tag,"LAST_PRICE: ",LAST_PRICE)
        let predictPrice = LAST_PRICE + (LAST_PRICE * 0.001)
        let inTenMinutes = new Date().getTime() + (1000 * 60 * 10)
        log.info(tag,"predictPrice: ",predictPrice)

        let result = await make_prediction("BTC",inTenMinutes.toString(),predictPrice.toString())

        return result
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};

let sign_up = async function () {
    let tag = " | make_prediction | ";
    try {
        log.info(tag, "USERNAME,ACCOUNT: ",{USERNAME,ACCOUNT});

        //create account
        let signup = await fomo.create(USERNAME,ACCOUNT)
        log.info("signup success! ",signup)

        return signup;
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};

let change_username = async function (username:string) {
    let tag = " | make_prediction | ";
    try {
        log.info(tag, "username: ",username);

        let result = updateConfig({username});

        return result;
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};


let make_prediction = async function (coin:string,time:string,price:string) {
    let tag = " | make_prediction | ";
    try {
        log.info(tag, "checkpoint: ");

        let prediction = {
            coin,
            time,
            price
        }

        let predictionResult = await fomo.predict(prediction)
        console.log("predictionResult: ",predictionResult)

        return predictionResult;
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};


let onRun: (this: any) => Promise<void>;
onRun = async function (this: any) {
  let tag = TAG + " | onRun | "
  try {
    //get strat
    log.info(tag, "strategy: ", STRATERGY)
    let engine = await bot.init(STRATERGY);
    await sleep(4000);

    //get recent history
    let allTrades = await tradesDB.find({selector: "bitmex.BTC-USD"}, {limit: 10000, sort: {time: -1}})
    log.info(tag, "total trades: ", allTrades.length)

    //Load trades to engine
    chalk.blue(
      " Loading trades into the Fomo engine! "
    )
    bot.load(allTrades)
    await sleep(6000);

    // @ts-ignore
    engine.on('events', async message => {
      //event triggerd
      log.info("**** Signal event: **** ", message)
      if (message.signal === "sell") {
        sell_signal()

      } else if (message.signal === "buy") {
        //goBull
        buy_signal()

      } else {
        log.error("Unknown Signal!  message: ", message)
      }
    });
    const client = new BitMEXClient();
    //sub to trades
    client.addStream('XBTUSD', 'trade', function (data: any, symbol: any, tableName: any) {
      log.debug(tag, "Stream: ", data, symbol, tableName)


      let clean = []
      for (let i = 0; i < data.length; i++) {
        let tradeInfo = data[i]
        let normalized: any = {}
        normalized.trade_id = tradeInfo.trdMatchID
        normalized.time = new Date(tradeInfo.timestamp).getTime()
        normalized.unix = new Date(tradeInfo.timestamp).getTime()
        normalized.size = tradeInfo.size
        normalized.side = tradeInfo.side
        normalized.price = tradeInfo.price
        LAST_PRICE = tradeInfo.price
        clean.push(normalized)
      }
      bot.load(clean)
    })
  } catch (e) {
    log.error(tag, e)
    throw Error(e)
  }
};

// let onBackfill = async function(){
//   let tag = TAG + " | onBackfill | "
//   try{
//     //get backfill status
//
//     //if not done, backfill
//
//   }catch(e){
//     log.error(tag,e)
//     throw Error(e)
//   }
// }


let init_wallet = async function (config:any,wallet:any,password:string) {
    let tag = " | init_wallet | ";
    try {
        log.info(tag, "checkpoint: ");
        log.info(tag, "config username: ",config.username);
        log.info(tag, "password: ",password);
        log.info(tag, "wallet: ",wallet);
        let output: any = [];
        const cryptr = new Cryptr(password);

        let walletInfo = await getWallet()
        log.debug(tag,"walletInfo: ",walletInfo)
        //get seed
        let seed = cryptr.decrypt(walletInfo.vault)
        WALLET_SEED = seed
        log.debug(tag,"seed: ",seed)
        //init client
        let apiKeys = await keyTools.onBuildWallet(seed);
        log.debug(tag,"apiKeys: ",apiKeys)

        USERNAME = config.username
        ACCOUNT = apiKeys.account
        API_KEY = apiKeys.apiKey

        let urlSpec = process.env['URL_FOMO_SPEC'] || "https://fomobro.com/spec/swagger.json"
        await fomo.init(urlSpec,{apiKey:apiKeys.account})

        //health
        let health = await fomo.health()
        console.log("health: ",health)

        //user info
        let userInfo = await fomo.getUser(config.username)
        console.log("health: ",health)

        //if available
        if(userInfo.isAvailable){
            //signup
            //create account
            let signup = await fomo.create(config.username,apiKeys.account)
            log.info("signup success! ",signup)

        } else {
            //verify ownership
            let userInfoPrivate = await fomo.getInfo()
            log.info("userInfoPrivate: ",userInfoPrivate)

            if(userInfoPrivate.account === apiKeys.account){
                log.info("Account info valid!")
            } else {
                log.info(tag,"userInfoPrivate.account: ",userInfoPrivate.account)
                log.info(tag,"apiKeys.account: ",apiKeys.account)
                //if fail/change username
                log.error(tag," Account does NOT match username! ERROR! recover or make new username to continue! ")
            }
        }


        return true;
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};
