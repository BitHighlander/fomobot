#!/usr/bin/env node

/*
      FOMObot cli
          -Highlander
 */
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"../../../../.env"});

const TAG = " | App | "
import {
  getConfig,
  setConfig,
  updateConfig,
  checkConfigs,
  backtestDir
} from './modules/config'

//Modules
const view = require("@fomobro/views")
const queue = require("@fomobro/redis-queue")
const Cryptr = require('cryptr');
const bot = require("@fomobro/fomobot")
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const log = require("loggerdog-client")()
const BitMEXClient = require('bitmex-realtime-api');
const wait = require('wait-promise');
const db = require('monk')('localhost/zenbot4')

//globals
const tradesDB = db.get('trades')
const client = new BitMEXClient();
const sleep = wait.sleep;

let LAST_PRICE:any
let SELECTED_STRAT = "bollinger"
let WALLET_PASSWORD:string

if(process.env['WALLET_PASSWORD']){
  WALLET_PASSWORD = process.env['WALLET_PASSWORD']
  log.info("Password loaded from env! ",WALLET_PASSWORD)
}

//Title
clear();
console.log(
  chalk.red(
    figlet.textSync('Fomo-Bitmex WORKER', { horizontalLayout: 'full' })
  )
);

process.on('uncaughtException', function (e){
  console.log(e);
})


let onRun: (this: any) => Promise<void>;
onRun = async function (this: any) {
  let tag = TAG + " | onRun | "
  try {
    //get strat
    log.info(tag, "strategy: ", SELECTED_STRAT)
    let engine = await bot.init(SELECTED_STRAT);
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
        let signal:any ={}
        signal.time = new Date().getTime()
        signal.strategy = SELECTED_STRAT
        signal.event = message.signal
        signal.lastPrice = LAST_PRICE

        //goBear
        queue.createWork("fomo-signal",signal)
        view.displayStringToChannel("SIGNAL: ("+signal.event+") last: "+signal.lastPrice+" Strat: "+signal.strategy,"markets")
      } else if (message.signal === "buy") {
        //goBull
        let signal:any ={}
        signal.time = new Date().getTime()
        signal.strategy = SELECTED_STRAT
        signal.event = message.signal
        signal.lastPrice = LAST_PRICE

        //goBull
        queue.createWork("fomo-signal",signal)
        view.displayStringToChannel("SIGNAL: ("+signal.event+") last: "+signal.lastPrice+" Strat: "+signal.strategy,"markets")
      } else {
        log.error("Unknown Signal!  message: ", message)
      }
    });

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

let onBackfill = async function(){
  let tag = TAG + " | onBackfill | "
  try{
    //get backfill status

    //if not done, backfill

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}

let onStart = async function(){
  let tag = TAG + " | onStart | "
  try{
    log.info(tag,"onStart()")
    let configStatus = checkConfigs()
    let config = getConfig()
    log.info(tag,"configStatus() | configStatus: ", configStatus)
    log.info(tag,"loadConfig() | config: ", config)

    //if configured AND command is run
    log.info(tag,"args: ",process.argv)
    log.info(tag,"args: ",process.argv[2])

    if(true){
      log.info(tag,"Starting Fomobot!")
      onRun()
    }

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}
onStart()
