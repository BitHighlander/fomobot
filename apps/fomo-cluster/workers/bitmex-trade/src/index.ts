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

import {
  initBot,
  updatePosition,
  getSummaryInfo,
  buySignal,
  sellSignal
} from './modules/fomobot'

//Modules
const queue = require("@fomobro/redis-queue")
const Cryptr = require('cryptr');
const {BitmexAPI, BitmexSocket} = require("bitmex-node");
const bot = require("@fomobro/fomobot")
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const log = require("loggerdog-client")()
const wait = require('wait-promise');
const db = require('monk')('localhost/zenbot4')
const { EventBus } = require('light-event-bus')

//globals
const eventBus = new EventBus()
const tradesDB = db.get('trades')
const sleep = wait.sleep;

// @ts-ignore
let EXCHANGES:any = {};

let LAST_PRICE:any
let WALLET_PASSWORD:string
let API_KEY_PUBLIC:string
let API_KEY_PRIVATE:string
let BALANCE_BTC
let IS_BULL:any
let IS_BEAR:any
let LEVERAGE = 20 // default

if(process.env['WALLET_PASSWORD']){
  WALLET_PASSWORD = process.env['WALLET_PASSWORD']
  log.info("Password loaded from env! ",WALLET_PASSWORD)
}

//Title
clear();
console.log(
  chalk.red(
    figlet.textSync('Fomo-Bitmex TRADE worker', { horizontalLayout: 'full' })
  )
);

process.on('uncaughtException', function (e){
  console.log(e);
})

let do_work = async function () {
  let tag = TAG + " | do_work | "
  let block
  try {

    //all work
    let allWorkHigh = await queue.count("fomo-signal")
    log.debug(tag, "HIGH WORK LEFT: ", allWorkHigh)

    let signal = await queue.getWork("fomo-signal", 1)
    if (signal) {
      log.info("**** Receive Signal! *****")
      if(!signal.event) throw Error(" Invalid signal! ")
      //if stale/ ignore
      //TODO

      //if buy AND !IS_BULL
      if(signal.event === 'buy'){
        buySignal(signal)
      }

      //if sell AND isBull
      if(signal.event === 'sell'){
        sellSignal(signal)
      }

    } else {
      log.debug(tag, " * WORKER HEALTHY * queues empty! ")
    }

  } catch (e) {
    log.error(tag, {e})
    //dead letter queue
    //redis.lpush(EXCHANGE + ":signal:ingest:deadletter", block)
    await sleep(300)
  }
  //dont stop working even if error
  await sleep(30)
  do_work()
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
      initBot(WALLET_PASSWORD,config,LEVERAGE)
      await updatePosition()
    }
    onUpdate()

    //start worker
    do_work()


  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}
onStart()


let onUpdate = async function(){
  let tag = TAG + " | onUpdate | "
  try{
      await updatePosition()
      let status = getSummaryInfo()
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
setInterval(onUpdate,5*1000)
