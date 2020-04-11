#!/usr/bin/env node

/*
      FOMObot cli
          -Highlander
 */
const TAG = " | App | "
import {
  getConfig,
  setConfig,
  updateConfig,
  checkConfigs,
  backtestDir
} from './modules/config'

//Modules
const bot = require("@fomobro/fomobot")
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const log = require("loggerdog-client")()
const BitMEXClient = require('bitmex-realtime-api');
const wait = require('wait-promise');

//globals
const client = new BitMEXClient();
const sleep = wait.sleep;

//Title
clear();
console.log(
  chalk.red(
    figlet.textSync('Fomo-cli', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .description(" An Automated trading program optimised to lose your money! ")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

let onRun = async function(){
  let tag = TAG + " | onRun | "
  try{
    //get strat
    let engine = await bot.init("ta_ultosc");
    await sleep(4000);

    engine.on('events', function (message:any) {
      //event triggerd
      log.info("event: ",message)
    });

    //sub to trades
    client.addStream('XBTUSD', 'trade', function (data:any, symbol:any, tableName:any) {
      log.info(tag,"Stream: ",data, symbol, tableName)

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

      //push trades to engine
      engine.update(clean,true,function(err:any){
        if(err) throw Error(err)
      })

    })
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