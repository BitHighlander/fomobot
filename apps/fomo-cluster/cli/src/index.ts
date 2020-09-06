#!/usr/bin/env node

/*
      FOMObot cli
          -Highlander
 */
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
const TAG = " | App | "
import {
  innitConfig,
  initWallet,
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
// const crypto = require("@bithighlander/hdwallet-pioneer/crypto")
const crypto = require("./modules/crypto")
const bot = require("@fomobro/fomobot")
const Cryptr = require('cryptr');
const bcrypt = require('bcryptjs');
const inquirer = require('inquirer');
const {BitmexAPI, BitmexSocket} = require("bitmex-node");
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
global.EXCHANGES = {};

let LAST_PRICE:any
let SELECTED_STRAT = "bollinger"
let WALLET_PASSWORD:string
let API_KEY_PUBLIC:string
let API_KEY_PRIVATE:string
let NEW_FLAG = false
let LEVERAGE = 20 // default

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

process.on('uncaughtException', function (e){
  console.log(e);
})

program
  .version('0.0.1')
  .option('-N, --new', ' Force  new User setup')
  .option('-S, --strategy <type>', ' Select Strategy [forex_analytics,bollinger,cci_srsi,crossover_vwap,dema,ichimoku_score,ichimoku,speed,wavetrend,trust_distrust,ta_ultosc,stddev,trendline,renko]')
  .option('-B, --backfill <type>', ' Select Backfill settings (in days)')
  .option('-P, --password <type>', ' Fomo Wallet Password')
  .option('-L, --leverage <type>', ' Leverage (The Magic Money Button)')
  .description(" An Automated trading program optimised to lose your money! ")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

//flags
if(program.strategy) SELECTED_STRAT = program.strategy
if(program.leverage) LEVERAGE = parseInt(program.leverage)
if(program.new) NEW_FLAG = true


let onRun: (this: any) => Promise<void>;
onRun = async function (this: any) {
  let tag = TAG + " | onRun | "
  try {

  } catch (e) {
    log.error(tag, e)
    throw Error(e)
  }
};


let onSetup = async function(){
  let tag = TAG + " | onBackfill | "
  try{
    //get backfill status

    //if not done, backfill
    const questions = [
      { type: 'input', name: 'language', message: 'lol, only english bro', default: "english" },
      { type: 'input', name: 'username', message: 'Select username', default: "billy" },
      { type: 'input', name: 'seed', message: 'restore from seed? (leave empty to create new)', default: "" },
      { type: 'input', name: 'bitmexPub', message: 'Bitmex PubKey', default: "" },
      { type: 'input', name: 'bitmexPriv', message: 'Bitmex PrivKey', default: "" },
      { type: 'password', name: 'password', message: 'password', default: "" },
      { type: 'password', name: 'password2', message: 'retype password', default: "" },
    ];
    //create config
    let answers = await inquirer.prompt(questions)
    log.info(tag,"answers: ",answers)


    await innitConfig("english")

    //validate answers
    if(answers.password !== answers.password2) throw Error(" passwords do not match! ")

    //if seed validateSeed
    let newSeed = await crypto.generateSeed()
    log.info(tag,"new Seed: ",newSeed)
    let wallet = await crypto.generateWalletFromSeed(newSeed)
    log.info(tag,"wallet: ",wallet)

    const cryptr = new Cryptr(answers.password);
    log.info(tag,"cryptr: ",cryptr)
    const hash = bcrypt.hashSync(answers.password, 10);
    log.info(tag,"hash: ",hash)
    //
    const encryptedString = cryptr.encrypt(newSeed);
    log.info('encryptedString: ',encryptedString)

    //create wallet
    await initWallet(encryptedString,hash)

    //TODO __test__ keys


    //save to config
    updateConfig({
      bitmexTest:true,
      bitmexPub:answers.bitmexPriv,
      bitmexPriv:answers.bitmexPriv,
    })

    return true
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

    //if new flag
    if(NEW_FLAG){
      //if config
      if(Object.keys(config).length > 1){
        //
        log.info("CONFIG FOUND! please backup and remove from home dir! ")
      } else {
        //signup
        //setup
        await onSetup()
      }
      // move current to backup
    }

    //if no config setup
    if(Object.keys(config).length === 0){
      await onSetup()
    }
    //
    if(!WALLET_PASSWORD){
      const questions = [
        { type: 'password', name: 'password', message: 'password', default: "" },
      ];

      let answers = await inquirer.prompt(questions)
      WALLET_PASSWORD = answers.password
    }

    //if no api keys setup exchange
    if(config.bitMexTestPub && config.bitMexTestPub){
      //decrypt
      await initBot(WALLET_PASSWORD,config,LEVERAGE)
      await updatePosition()
    } else {
      //
      log.error("invalid config! Can not start app!! missing bitmex keys! ")
    }
    //
    // //if configured AND command is run
    // log.info(tag,"args: ",process.argv)
    // log.info(tag,"args: ",process.argv[2])
    //
    // if(process.argv[2] === "run"){
    //   log.info(tag,"Starting Fomobot!")
    //   onRun()
    // }

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
    // log.info("summary lastPrice: ",status.LAST_PRICE)
    // log.info("summary balance Available: ",status.BALANCE_AVAILABLE)
    // log.info("summary balance Position: ",status.BALANCE_POSITION)
    // log.info("summary balance isBull: ",status.IS_BULL)
    // log.info("summary balance isBear: ",status.IS_BEAR)

    //positions

    //PNL

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}
//1min
setInterval(onUpdate,20*1000)
