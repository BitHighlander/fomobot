import path from "path";

const TAG = " | Config | "
const fs = require("fs-extra")
const homedir = require('os').homedir();
const mkdirp = require('mkdirp');
const finder = require('find-package-json');

export const fomoConfig = path.join(homedir, '.fomobro','fomobro.json')
export const configPath = path.join(homedir, '.fomobro','fomobro.json')
export const seedPath = path.join(homedir, '.fomobro', 'wallet_data/wallet.seed')
export const seedDir = path.join(homedir, '.fomobro', 'wallet_data')
export const fomoPath = path.join(homedir, '.fomobro')
export const modelDir = path.join(homedir, '.fomobro','models')
export const backtestDir = path.join(homedir, '.fomobro','backtest')
export const logDir = path.join(fomoPath, 'log')
export const fomoTrain = path.join(homedir, '.fomobro')

export function innitConfig(languageSelected:string){
  let tag = TAG + " | importConfig | "
  try{
    let output:any = {}
    console.log(tag,"CHECKPOINT innitConfig")
    console.log(tag,"fomoPath: ",fomoPath)
    console.log(tag,"seedDir: ",seedDir)

    mkdirp(fomoPath, function (err:any) {
      if (err) console.error(err)
      else console.log('created: ',fomoPath)
    });

    mkdirp(logDir, function (err:any) {
      if (err) console.error(err)
      else console.log('created: ',logDir)
    });


    mkdirp(seedDir, function (err:any) {
      if (err) console.error(err)
      else console.log('seedDir: ',seedDir)
    });


    console.log(tag," innit config checkpiont 2")

    let config:any = {}
    config.locale = "english"
    config.localeSelected = true
    config.version = "1.0.1"
    config.isCli = true

    fs.writeFileSync(fomoConfig,JSON.stringify(config))
  }catch (e) {
    console.error(tag,"e: ",e)
    return {}
  }
}

//innit Wallet
export async function initWallet(encryptedSeed: any, passwordHash: any) {
  let tag = TAG + " | initWallet | ";
  try {
    console.log(tag, "seedDir: ", seedDir);

    //make the dir
    let isCreated = await mkdirp(seedDir);
    //console.log("isCreated: ", isCreated);

    let output: any = {};
    //console.log(tag, "CHECKPOINT innitConfig");
    //console.log(tag, "encryptedSeed: ", encryptedSeed);


    let wallet: any = {};
    wallet.hash = passwordHash;
    wallet.version = 1;
    wallet.type = "seedwords";
    wallet.vault = encryptedSeed;

    let result = fs.writeFileSync(seedPath, JSON.stringify(wallet));
    //console.log("result: ", result);

    return true;
  } catch (e) {
    console.error(tag, "e: ", e);
    return {};
  }
}


//check
export function checkConfigs(){
  let output:any = {}
  output.isConfigured = false
  output.isWallet = false
  output.isRegistered = false

  let fileFound = fs.existsSync(fomoConfig)?true:false
  if(fileFound){
    output.config = JSON.parse(fs.readFileSync(configPath))
    if(output.config.version) output.isConfigured = true
    if(output.config.username) output.isRegistered = true
  }


  if(output.config  && output.config.version )output.isConfigured = true

  //wallet found?
  let walletFound = fs.existsSync(seedPath)?true:false
  if(walletFound){
    output.isWallet = true
  }

  return output
}

export function getWallet() {
  try {
    let walletBuff = fs.readFileSync(seedPath);
    let walletString = walletBuff.toString()
    let wallet = JSON.parse(walletString)

    return wallet
  } catch (e) {
    return {};
  }
}



export function getConfig(){
  try{
    let output = JSON.parse(fs.readFileSync(configPath))

    //update nodes if empty
    // if(!output.URL_PIONEER)this.updateConfig({URL_PIONEER})
    // if(!output.WS_PIONEER)this.updateConfig({WS_PIONEER})
    // if(!output.URL_GAIAD)this.updateConfig({URL_GAIAD})
    // if(!output.URL_GAIACLI)this.updateConfig({URL_GAIACLI})

    return output
  }catch (e) {
    return {}
  }
}

export function setConfig(options:any){
  return fs.writeFileSync(configPath, JSON.stringify(options))
}

export function updateConfig(options:any){
  let options_ = getConfig()
  for(var key in options){
    options_[key] = options[key]
  }
  setConfig(options_)
}

//export const logLevel = getConfig()['debug']?'debug':'info'
export const logLevel = 'debug'
