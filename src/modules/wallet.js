import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
//import {exec, execFile, spawn, fork} from 'child_process'

let Web3 = require('web3');
if(!process.env.INFURA_TOKEN) throw Error("1misconfiguration, cant find infura key!")
let web3 = new Web3("https://mainnet.infura.io/v3/"+process.env.INFURA_TOKEN);

//import axios from 'axios'

class WalletService {
    static online  = false

    static address
    static seed

    static initClient() {
        //read seed from config

        //query address balances
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
