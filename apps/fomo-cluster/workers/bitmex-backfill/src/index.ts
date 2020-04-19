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
const queue = require("@fomobro/redis-queue")
const Cryptr = require('cryptr');
const bot = require("@fomobro/fomobot")
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const log = require("loggerdog-client")()
const wait = require('wait-promise');
const db = require('monk')('localhost/zenbot4')

//globals
const tradesDB = db.get('trades')
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

    //backfill
    bot.backfill()

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
