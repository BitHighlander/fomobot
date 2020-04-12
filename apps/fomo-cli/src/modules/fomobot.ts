/**
    FOMOBOT Primary Functions

      * Lose you your retirement account

      -Highlander
 */

let TAG = " | FOMOBOT | "
const log = require("loggerdog-client")()

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
let BALANCES:any = [];
let EXCHANGES:any = {};
let LAST_PRICE:any = 0;
let PCT_IN_POSITION = 0;
let POSITIONS:any = [];
let POSITION_NATIVE = 0;
let POSITION_PNL = 0;

export function initBot(password:string,config:any){
  let tag = TAG + " | initBot | "
  try{

    let encryptedPriv = config.bitMexTestPriv;
    log.info("encryptedPriv: ",encryptedPriv)
    log.info("WALLET_PASSWORD: ",password)
    const cryptr = new Cryptr(password);
    let priv = cryptr.decrypt(encryptedPriv)
    log.info(tag,"decrypted privkey: ",priv)
    API_KEY_PRIVATE = priv

    //load to global
    EXCHANGES['bitmex'] = new BitmexAPI({
      "apiKeyID": config.bitMexTestPub,
      "apiKeySecret": priv,
      "testnet": true
      // "proxy": "https://cors-anywhere.herokuapp.com/" //TODO setup proxy
    })

  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export async function updatePosition(){
  let tag = TAG + " | updatePosition | "
  try{

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

  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export async function buySignal(){
  let tag = TAG + " | buySignal | "
  try{

    //
    if (IS_BEAR || !IS_BULL) {
      //go bull

      //get position

      //amount = position X 2
      let amount = Math.abs(POSITION_NATIVE) * 2
      if (!amount || amount < 0) amount = 1000
      log.info(tag, "amount: ", amount)


      log.info(tag, "LAST_PRICE: ", LAST_PRICE)
      let price = LAST_PRICE + (LAST_PRICE * 0.01)
      price = price.toFixed(0)
      log.info(tag, "price: ", price)

      let result = await EXCHANGES['bitmex'].Order.new({
        symbol: "XBTUSD",
        orderQty: amount,
        price: price,
        leverage: "5"
      })
      log.info("result: ", result)

      IS_BULL = true
      IS_BEAR = false
    }

  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export async function sellSignal(){
  let tag = TAG + " | sellSignal | "
  try{
    //
    log.info(tag, "Sell signal!")
    await updatePosition()
    //
    if (IS_BULL || !IS_BEAR) {
      //go bull


      let amount = Math.abs(POSITION_NATIVE)
      if (!amount || amount < 0) amount = 1000

      log.info(tag, "amount: ", amount)
      amount = amount * -1

      log.info(tag, "LAST_PRICE: ", LAST_PRICE)
      let price:any = LAST_PRICE - (LAST_PRICE * 0.01)
      price = price.toFixed(0)
      log.info(tag, "price: ", price)

      let result = await EXCHANGES['bitmex'].Order.new({
        symbol: "XBTUSD",
        orderQty: amount,
        price: price,
        leverage: "5"
      })
      log.info("result: ", result)


      IS_BULL = true
      IS_BEAR = false
    }
  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export function getSummaryInfo(){
  let tag = TAG + " | getSummaryInfo | "
  try{

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
  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

