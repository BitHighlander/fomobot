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
  backtestDir,
  innitConfig,
  initWallet,
  getWallet
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
const inquirer = require('inquirer');
//const {BitmexAPI, BitmexSocket} = require("bitmex-node");

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const log = require("loggerdog-client")()

const wait = require('wait-promise');
const db = require('monk')('localhost/zenbot4')
const { EventBus } = require('light-event-bus')
const wallet = require("@fomobro/fomo-wallet")
const shortid = require('shortid');
const vorpal = require("vorpal")();
const describe = require("describe-export");
const bcrypt = require("bcryptjs");
// @ts-ignore
import {v4 as uuidv4} from 'uuid';

//app
let App = require("./app");

//globals
const eventBus = new EventBus()
const tradesDB = db.get('trades')
const sleep = wait.sleep;

// @ts-ignore
global.EXCHANGES = {};

let urlSpec = process.env['URL_FOMO_SPEC'] || "https://fomobro.com/spec/swagger.json"

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

// let order = { symbol: 'XBTUSD', orderQty: -100, price: '6753' }
// console.log("settings: ",{
//   "apiKeyID": API_KEY_PRIVATE,
//   "apiKeySecret": API_KEY_PUBLIC,
//   "testnet": true
//   // "proxy": "https://cors-anywhere.herokuapp.com/" //TODO setup proxy
// })
//
// let client = new BitmexAPI({
//   "apiKeyID": API_KEY_PRIVATE,
//   "apiKeySecret": API_KEY_PUBLIC,
//   "testnet": true
//   // "proxy": "https://cors-anywhere.herokuapp.com/" //TODO setup proxy
// })
//
// client.Order.new(order)
//   .then(function(resp:any){
//     log.info(tag,"Order Resp: ",resp)
//   })
//   .catch(function(e:any){
//     log.error(e)
//     log.error(e.message)
//     let trimBack = e.message.split(" XBt ")
//     log.error(trimBack)
//     let trimFront = trimBack[0].split("Account has insufficient Available Balance, ")
//     let neededForOrder = trimFront[1]
//     log.error("neededForOrder: ",parseInt(neededForOrder) / 100000000)
//   })

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
  let tag = TAG + " | onRun | ";
  try {
    //init wallet
    let config = getConfig()
    let wallet = getWallet()
    App.init(config, wallet, WALLET_PASSWORD)

    log.info(tag, " Starting Interactive Terminal ");
    //globals
    let prompt = "client: ";
    var locked = true;
    var USER = null;

    //map module
    const map = describe.map(App);
    //log.info("methods known: ", map);

    let help: any = {
      info: "",
    };

    Object.keys(map).forEach(function (key) {
      let tag = TAG + " | " + key + " | ";
      let debug = false;
      log.debug(tag, "key: ", key);
      let expectedParams = map[key];

      log.debug(tag, "expectedParams: ", expectedParams);

      let helpString;
      if (help[key]) helpString = help[key];
      if (!helpString)
        helpString = " \n \n " + key + ": expected params: " + expectedParams;

      vorpal.command(key, helpString)
          .action(function (args: any, cb: any) {
            let params = [];
            if(key === 'makePrediction'){
              log.info(" 30 seconds ******** ", new Date().getTime() + 1000 * 30)
              log.info(" 1 min ******** ", new Date().getTime() + 1000 * 60)
              log.info(" 5 min ******** ", new Date().getTime() + 1000 * 60 * 5)
              log.info(" 10 min ******** ", new Date().getTime() + 1000 * 60 * 10)
              log.info(" 30 min ******** ", new Date().getTime() + 1000 * 60 * 30)
            }
            if (expectedParams.length > 0) {
              for (let i = 0; i < expectedParams.length; i++) {
                let param = {
                  type: "input",
                  name: expectedParams[i],
                  message: "input " + expectedParams[i] + ": ",
                };
                params.push(param);
              }
            }

            // @ts-ignore
            let promise = this.prompt(params, function (answers: any) {
              // You can use callbacks...
            });

            promise.then(async function (answers: any) {
              log.debug(tag, "answers: ", answers);

              let parameters: any = [];
              Object.keys(answers).forEach(function (answer) {
                parameters.push(answers[answer]);
              });
              log.info(tag, "parameters: ", parameters);
              try {
                // @ts-ignore
                const result = await App[key].apply(this, parameters);
                log.info("result: ", result);

                cb()
              } catch (e) {
                console.error(tag, "e: ", e);
              }
            });
          })
    })

    vorpal
        .delimiter(prompt)
        //.action(app.tick())
        .show();

  } catch (e) {
    log.error(tag, e);
    throw Error(e);
  }
};

let onSetup = async function(){
  let tag = TAG + " | onBackfill | "
  try{
    //get backfill status

    //if not done, backfill


    const questions = [
      {
        type: "input",
        name: "username",
        message: "Select username",
        default: "billy",
      },
      {
        type: "list",
        name: "task",
        message: "What do you want to do?",
        choices: ["create a new wallet", "restore from seed"],
      },
      {type: "password", name: "password", message: "password", default: ""},
      {
        type: "password",
        name: "password2",
        message: "confirm password",
        default: "",
      },
    ];

    inquirer.prompt(questions).then(async function (answers: any) {
      if (answers.password !== answers.password2)
        throw Error("Passwords do not match! ");

      //hashpw
      const hash = bcrypt.hashSync(answers.password, 10);

      if (answers.task === "create a new wallet") {
        let seed = await wallet.onGetNewSeed()
        seed = seed.seed
        log.info(" * SAVEME * Your Seed Phrase! seed: " + seed);

        //encrypt
        const cryptr = new Cryptr(answers.password);
        let seed_encrypted = cryptr.encrypt(seed);
        //
        log.debug(tag, "seed_encrypted: ", seed_encrypted);
        log.debug(tag, "hash: ", hash);
        await innitConfig("english");

        //generate query key
        const queryKey = uuidv4();

        //
        log.info(tag, "queryKey: ", queryKey)
        updateConfig({queryKey: queryKey});
        updateConfig({username: answers.username});
        updateConfig({password: hash});
        updateConfig({created: new Date().getTime()});

        await initWallet(seed_encrypted, hash);
        log.info("Wallet initialized! please restart cli! ");

        //register account key

        process.exit(0);
      }

      if (answers.task === "restore from seed") {
        log.info(tag, " restore from seed ")
        //ask for seed
        onRestore(answers.username, answers.password)
      }

    });

  }catch(e){
    log.error(tag,e)
    throw Error(e)
  }
}

let onRestore = async function (username: string, password: string) {
  let tag = TAG + " | onSetup | ";
  try {
    //get backfill status

    //if not done, backfill

    const questions = [
      {
        type: "input",
        name: "Seed",
        message: "Insert your 12 or 24 word mnemonics",
        default: "alcohol woman abuse must during monitor noble actual mixed trade anger aisle",
      }
    ];

    inquirer.prompt(questions).then(async function (answers: any) {
      //TODO validate seed

      //hashpw
      const hash = bcrypt.hashSync(password, 10);

      let seed = answers.Seed;
      log.debug(" Your Seed Phrase! seed: " + seed);

      //encrypt
      const cryptr = new Cryptr(password);
      let seed_encrypted = cryptr.encrypt(seed);
      //
      log.debug(tag, "seed_encrypted: ", seed_encrypted);
      log.debug(tag, "hash: ", hash);
      await innitConfig("english");

      //
      updateConfig({username: username});
      updateConfig({password: hash});
      updateConfig({created: new Date().getTime()});

      await initWallet(seed_encrypted, hash);
      log.info("Wallet initialized! please restart cli! ");

      //register account key

      process.exit(0);

    });
  } catch (e) {
    log.error(tag, e);
    throw Error(e);
  }
};

let onStart = async function(){
  let tag = TAG + " | onStart | "
  try{
    log.info(tag,"onStart()")
    let configStatus = checkConfigs()
    let config = getConfig()
    log.info(tag,"configStatus() | configStatus: ", configStatus)
    log.info(tag,"loadConfig() | config: ", config)

    if(Object.keys(config).length === 0){
      //empty config, setup
      onSetup()
    } else {
      if(!WALLET_PASSWORD){
        const questions = [
          { type: 'password', name: 'password', message: 'password', default: "" },
        ];

        inquirer
            .prompt(questions)
            .then(async function (answers:any) {
              console.log(answers);
              WALLET_PASSWORD = answers.password

              //TODO verify password!

              //decrypt

              //if no api keys setup exchange
              // if(config.bitMexTestPub && config.bitMexTestPub){
              //   //decrypt
              //   await initBot(WALLET_PASSWORD,config,LEVERAGE)
              //   await updatePosition()
              // }

              //if configured AND command is run
              log.info(tag,"args: ",process.argv)
              log.info(tag,"args: ",process.argv[2])
              log.info(tag,"Starting Fomobot!")
              onRun()
            })

      }
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
