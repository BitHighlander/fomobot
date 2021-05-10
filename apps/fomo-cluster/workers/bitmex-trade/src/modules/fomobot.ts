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
let POSITION_SIZE_USD = 1000

let API_KEY_PRIVATE:any;
let API_KEY_PUBLIC:any;
let BALANCE_AVAILABLE = 0;
let BALANCE_POSITION = 0;
let BALANCES:any = [];
let EXCHANGES:any = {};
let PCT_IN_POSITION = 0;
let POSITIONS:any = [];
let POSITION_CONTRACTS = 0;
let POSITION_PNL = 0;

export async function initBot(password:string,config:any,leverage:number){
  let tag = TAG + " | initBot | "
  try{

    let encryptedPriv = config.bitMexTestPriv;
    log.info("encryptedPriv: ",encryptedPriv)
    log.info("WALLET_PASSWORD: ",password)
    const cryptr = new Cryptr(password);
    let priv = cryptr.decrypt(encryptedPriv)
    log.info(tag,"decrypted privkey: ",priv)
    API_KEY_PRIVATE = priv
    API_KEY_PUBLIC = config.bitMexTestPub
    //load to global

    if(API_KEY_PRIVATE && API_KEY_PUBLIC){
      EXCHANGES['bitmex'] = new BitmexAPI({
        "apiKeyID": API_KEY_PUBLIC,
        "apiKeySecret": API_KEY_PRIVATE,
        "testnet": true
        // "proxy": "https://cors-anywhere.herokuapp.com/" //TODO setup proxy
      })
    }

    //update leverage
    let leverageSucces = await EXCHANGES['bitmex'].Position.updateLeverage({symbol:"XBTUSD",leverage:leverage})
    log.info(tag,"leverageSucces: ",leverageSucces)




    return {API_KEY_PRIVATE,API_KEY_PUBLIC}
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

    let balance = parseInt(wallet.deltaAmount) / 100000000
    log.info("updatePosition() | balance: ", balance)
    BALANCE_AVAILABLE = balance

    let positions = await client.Position.get()
    log.debug("updatePosition() | positions: ", positions)

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
      if (positions[0].lastValue > 0) {
        IS_BULL = false
        IS_BEAR = true
      }

      if (positions[0].lastValue < 0) {
        IS_BULL = true
        IS_BEAR = false
      }
    }
    return true
  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export async function buySignal(signal:any){
  let tag = TAG + " | buySignal | "
  try{
    log.info(tag,"Checkpoint")
    //
    if (IS_BEAR || !IS_BULL) {

      let lastPrice = signal.lastPrice
      //go bull
      log.info(tag,"Going Bull!")
      //get position

      //amount = position X 2
      log.info(tag,"POSITION_CONTRACTS: ",POSITION_CONTRACTS)
      let amount = Math.abs(POSITION_CONTRACTS)
      if (!amount || amount < 0) amount = POSITION_SIZE_USD
      if(IS_BEAR) amount = amount * 2
      log.info(tag, "amount: ", amount)

      log.info(tag, "lastPrice: ", lastPrice)
      let price = lastPrice + (lastPrice * 0.01)
      price = price.toFixed(0)
      log.info(tag, "price: ", price)

      IS_BULL = true
      IS_BEAR = false

      let order = {
        symbol: "XBTUSD",
        orderQty: amount,
        price: price
      }
      log.info(tag,"Order: ",order)

      EXCHANGES['bitmex'].Order.new(order)
        .then(function(resp:any){
          log.info(tag,"Order Resp: ",resp)
        })
        .catch(function(e:any){
          log.error(e)
          log.error(e.message)
          let trimBack = e.message.split(" XBt ")
          log.error(trimBack)
          let trimFront = trimBack[0].split("Account has insufficient Available Balance, ")
          let neededForOrder = trimFront[1]
          log.error("neededForOrder: ",parseInt(neededForOrder) / 100000000)
        })

    } else {
      log.info(tag,"Already a Bull!")
    }

  }catch (e) {
    console.error(tag,"e: ",e)
    return e
  }
}

export async function sellSignal(signal:any){
  let tag = TAG + " | sellSignal | "
  try{
    //
    log.info(tag, "Sell signal!")
    if (IS_BULL || !IS_BEAR) {
      let lastPrice = signal.lastPrice
      //go bear
      log.info(tag,"Going Bear! !!!  bro")
      log.info(tag,"exchanges: ",EXCHANGES['bitmex'])

      //order
      let amount = Math.abs(POSITION_CONTRACTS)
      if (!amount || amount < 0) amount = POSITION_SIZE_USD
      if(IS_BULL) amount = amount * 2

      log.info(tag, "amount: ", amount)
      amount = amount * -1

      log.info(tag, "lastPrice: ", lastPrice)
      let price:any = lastPrice - (lastPrice * 0.01)
      price = price.toFixed(0)
      log.info(tag, "price: ", price)

      IS_BULL = false
      IS_BEAR = true

      let order = {
        symbol: "XBTUSD",
        orderQty: amount,
        price: price
      }
      log.info(tag,"Order: ",order)

      EXCHANGES['bitmex'].Order.new(order)
        .then(function(resp:any){
          log.info(tag,"Order Resp: ",resp)
        })
        .catch(function(e:any){
          log.error(e)
          log.error(e.message)
          let trimBack = e.message.split(" XBt ")
          log.error(trimBack)
          let trimFront = trimBack[0].split("Account has insufficient Available Balance, ")
          let neededForOrder = trimFront[1]
          log.error("neededForOrder: ",parseInt(neededForOrder) / 100000000)
        })
    } else {
      log.info(tag,"Already a Bear!")
    }
  }catch (e) {
    console.error(tag,"e: ",e)
    throw e
  }
}

export function getSummaryInfo(){
  let tag = TAG + " | getSummaryInfo | "
  try{

    let output = {
      online: IS_INIT,
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
