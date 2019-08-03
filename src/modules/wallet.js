import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
const Cryptr = require('cryptr');
//import {exec, execFile, spawn, fork} from 'child_process'

let Web3 = require('web3');
if(!process.env.INFURA_TOKEN) throw Error("1misconfiguration, cant find infura key!")
let web3 = new Web3("https://mainnet.infura.io/v3/"+process.env.INFURA_TOKEN);

//locals
import {getWallet} from './config'
import log from './logger'
//import axios from 'axios'

class WalletService {
    static online  = false

    static address
    static seed
    static password

    static initClient(password) {
        if(!password) throw Error("101: password required!")
        //read seed from config
        let wallet = getWallet()
        log.debug("wallet: ",wallet)

        //decrypt

        //query address balances

        this.online = true
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
