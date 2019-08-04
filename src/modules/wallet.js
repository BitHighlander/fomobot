
import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
const Cryptr = require('cryptr');
const bip39 = require('bip39')
const HDKey = require('hdkey')
const ethUtil = require('ethereumjs-util');
const coininfo = require('coininfo')
const EthereumBip44 = require('ethereum-bip44-update');
let bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const bip32 = require(`bip32`)
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

    static async initClient(password) {
        if(!password) throw Error("101: password required!")
        log.debug("password: ",password)
        const cryptr = new Cryptr(password);

        //read seed from config
        let wallet = getWallet()
        wallet = JSON.parse(wallet)
        log.debug("wallet: ",wallet)

        //decrypt
        let mnemonic = cryptr.decrypt(wallet.vault);
        mnemonic = mnemonic.replace(/,/g, ' ');
        mnemonic = mnemonic.trim()
        SEED = mnemonic

        // throws if mnemonic is invalid
        bip39.validateMnemonic(mnemonic)

        const seed = await bip39.mnemonicToSeed(mnemonic)
        // let masterKey =  new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo(network).versions.bip32.versions)
        // log.debug("masterKey: ",masterKey)
        let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
        log.debug(mk.publicExtendedKey)

        //get Eth key
        mk = mk.derive("m/44'/60'/0'/0")
        log.debug(mk.publicExtendedKey)

        //get correct address with xpub
        let xpub = mk.publicExtendedKey
        let xpriv = mk.privateExtendedKey
        log.debug("xpub: ",xpub)

        let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).publicKey
        let privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).privateKey
        log.debug("publicKey: ",publicKey)
        log.debug("privateKey: ",ethUtils.bufferToHex(privateKey))
        //
        let address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true));
        log.debug("address: ",address)

        const masterKey = bip32.fromSeed(seed)
        //return {masterKey,xpub,address}

        //output the first address
        MASTER_ADDRESS = address
        log.debug("MASTER ADDRESS: ",address)
        MASTER_PRIVATE = ethUtils.bufferToHex(privateKey)

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
