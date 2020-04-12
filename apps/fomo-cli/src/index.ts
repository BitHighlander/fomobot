#!/usr/bin/env node

/*
      FOMObot cli
          -Highlander
 */
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
const TAG = " | App | "
import {
  getConfig,
  setConfig,
  updateConfig,
  checkConfigs,
  backtestDir
} from './modules/config'

import {
  initBot,
  updatePosition,
  getSummaryInfo,
  buySignal,
  sellSignal
} from './modules/fomobot'

//Modules
const Cryptr = require('cryptr');
const {BitmexAPI, BitmexSocket} = require("bitmex-node");
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

let SELECTED_STRAT = "bollinger"
let WALLET_PASSWORD:string
let API_KEY_PUBLIC:string
let API_KEY_PRIVATE:string
let EXCHANGES:any
let BALANCE_BTC
let IS_BULL
let IS_BEAR

if(process.env['WALLET_PASSWORD']){
  WALLET_PASSWORD = process.env['WALLET_PASSWORD']
  log.info("Password loaded from env! ",WALLET_PASSWORD)
}

//Title
clear();
console.log(
  chalk.red(
    figlet.textSync('Fomo-cli', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .option('-S, --strategy <type>', ' Select Strategy [forex_analytics,bollinger,cci_srsi,crossover_vwap,dema,ichimoku_score,ichimoku,speed,wavetrend,trust_distrust,ta_ultosc,stddev,trendline,renko]')
  .option('-B, --backfill <type>', ' Select Backfill settings (in days)')
  .option('-P, --password <type>', ' Fomo Wallet Password')
  .description(" An Automated trading program optimised to lose your money! ")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

//flags
if(program.strategy) SELECTED_STRAT = program.strategy


let onRun = async function(){
  let tag = TAG + " | onRun | "
  try{
    //get strat

    log.info(tag,"strategy: ",program.strategy)
    let engine = await bot.init(SELECTED_STRAT);
    await sleep(4000);

    //get recent history
    let allTrades = await tradesDB.find({selector:"bitmex.BTC-USD"},{limit:10000,sort:{time:-1}})
    //log.info(tag,"total trades: ",allTrades.length)

    //Load trades to engine
    chalk.blue(
      " Loading trades into the Fomo engine! "
    )
    bot.load(allTrades)
    await sleep(6000);


    engine.on('events', function (message:any) {
      //event triggerd
      log.info("**** Signal event: **** ",message)
      if(message.signal === "sell"){
        //goBear
        sellSignal()
      } else if(message.signal === "buy") {
        //goBull
        sellSignal()
      } else {
        log.error("Unknown Signal!  message: ",message)
      }

    });

    //sub to trades
    client.addStream('XBTUSD', 'trade', function (data:any, symbol:any, tableName:any) {
      log.debug(tag,"Stream: ",data, symbol, tableName)

      let clean = []
      for(let i = 0; i < data.length; i++){
        let tradeInfo = data[i]

        //console.log("tradeInto: ",tradeInfo)

        //let price
        let price = tradeInfo.price
        let amount = tradeInfo.size
        // console.log("price: ",price)
        // console.log("amount: ",amount)

        let normalized:any = {}
        normalized.trade_id = tradeInfo.trdMatchID
        normalized.time = new Date(tradeInfo.timestamp).getTime()
        normalized.unix = new Date(tradeInfo.timestamp).getTime()
        normalized.size = tradeInfo.size
        normalized.side = tradeInfo.side
        normalized.price = tradeInfo.price
        clean.push(normalized)
      }
      bot.load(clean)

      //console.log("****",engine)
      //push trades to engine
      // engine.load(clean,true,function(err:any){
      //   if(err) throw Error(err)
      // })

    })
  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}

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

    //if no config setup

    //if no api keys setup exchange
    if(config.bitMexTestPub && config.bitMexTestPub){
      //decrypt
      await initBot(WALLET_PASSWORD,config)
      await updatePosition()
    }

    //if configured AND command is run
    log.info(tag,"args: ",process.argv)
    log.info(tag,"args: ",process.argv[2])

    if(process.argv[2] === "run"){
      log.info(tag,"Starting Fomobot!")
      onRun()
    }

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}
onStart()


let onUpdate = async function(){
  let tag = TAG + " | onUpdate | "
  try{
      let status = getSummaryInfo()
      log.info("summary lastPrice: ",status.LAST_PRICE)
      log.info("summary balance Available: ",status.BALANCE_AVAILABLE)
      log.info("summary balance Position: ",status.BALANCE_POSITION)
      log.info("summary balance isBull: ",status.IS_BULL)
      log.info("summary balance isBear: ",status.IS_BEAR)

      //positions

      //PNL

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}
//1min
setInterval(onUpdate,20*1000)