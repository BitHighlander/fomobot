
import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
const Cryptr = require('cryptr');
const bip39 = require('bip39')
const HDKey = require('hdkey')
const coininfo = require('coininfo')
const EthereumBip44 = require('ethereum-bip44-update');
//import {exec, execFile, spawn, fork} from 'child_process'

let Web3 = require('web3');
if(!process.env.INFURA_TOKEN) throw Error("1misconfiguration, cant find infura key!")
let web3 = new Web3("https://mainnet.infura.io/v3/"+process.env.INFURA_TOKEN);

//locals
import {getWallet} from './config'
import log from './logger'
//import axios from 'axios'
let BASE = 1000000000000000000;
let online = false
let MASTER_ADDRESS
let MASTER_PRIVATE
let XPUB
let SEED
let password_

class WalletService {

    static setPassword(password){
        password_ = password
    }

    static getPassword(){
        return password_
    }

    static initClient(password) {
        if(!password) throw Error("101: password required!")
        log.debug("password: ",password)
        const cryptr = new Cryptr(password);

        //read seed from config
        let wallet = getWallet()
        wallet = JSON.parse(wallet)
        log.debug("wallet: ",wallet)

        //decrypt
        let mnemonic = cryptr.decrypt(wallet.vault);
        SEED = mnemonic
        // mnemonic = mnemonic.split(" ")
        log.debug("mnemonic: ",mnemonic)

        //get master address
        let seed = bip39.mnemonicToSeedHex(mnemonic)
        seed = seed.toString().trim()
        seed = seed.replace(/,/gi,' ');
        log.debug("seed: ",seed)

        var mk = new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo('BTC').versions.bip32)
        log.debug(mk.privateExtendedKey)


        //create the hd wallet
        let ethWallet = EthereumBip44.fromPrivateSeed(mk.privateExtendedKey);
        //output the first address
        MASTER_ADDRESS = ethWallet.getAddress(0)
        log.debug(ethWallet.getAddress(0))
        MASTER_PRIVATE = ethWallet.getPrivateKey(0)

        //query address balances
        web3.eth.getBalance(MASTER_ADDRESS,function(error,result){
            if(!error){
                let balance = result.toString()/BASE
                log.debug("balance: ",balance)
            } else {
                console.error(error,result)
            }
        });


        this.online = true

        return
    }

    static async getSummaryInfo() {
        let output = {online:this.online}
        //get balance?
        output.balance = 1000

        //set globals?
        return output
    }

    static subscribeToPayments() {
        //get balance?

        //set globals?
    }

    static sendToken(coin,address,amount) {
        //get balance?

        //set globals?
    }
}


export default WalletService
