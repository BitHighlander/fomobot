
import fs from 'fs'
const fse = require('fs-extra')
const path = require('path')
const Cryptr = require('cryptr');
const bip39 = require('bip39')
const HDKey = require('hdkey')
const ethUtil = require('ethereumjs-util');
const coininfo = require('coininfo')
const EthereumBip44 = require('ethereum-bip44-update');
const bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const bip32 = require(`bip32`)
const Promise = require("bluebird");
//import {exec, execFile, spawn, fork} from 'child_process'
const TX = require("ethereumjs-tx").Transaction;
const bcrypt = require('bcryptjs');

let Web3 = require('web3');
// if(!process.env.INFURA_TOKEN) throw Error("1misconfiguration, cant find infura key!")
// let web3 = new Web3("https://mainnet.infura.io/v3/"+process.env.INFURA_TOKEN);
if(!process.env.INFURA_TOKEN) console.error(" YOU SUCK AT CODING! BRO")
let web3 = new Web3("https://mainnet.infura.io/v3/410e6d85bc2e43c89920f271ac8e768d");


//locals
import {getWallet} from './config'
import log from './logger'

//import axios from 'axios'
let BASE = 1000000000000000000;
let online = false
let MASTER_ADDRESS
let MASTER_PRIVATE
let ETH_BALANCE
let FOMO_BALANCE
let XPUB
let SEED
let password_
let TXS_ALL = []

let token = "FOMO";
let abiInfo = require("../coins/"+token.toUpperCase()+".abi.js");

class WalletService {

    static setPassword(password){
        password_ = password
    }

    static getPassword(){
        return password_
    }

    static getAllTxs(){
        return TXS_ALL
    }

    static async displaySeed(password){
        try{
            log.debug("password: ",password)
            //validate password
            //read seed from config
            let wallet = getWallet()
            wallet = JSON.parse(wallet)
            log.debug("wallet: ",wallet)

            //validate pw
            let isValid = bcrypt.compareSync(password, wallet.hash); // true
            if(isValid){
                const cryptr = new Cryptr(password);
                //decrypt
                let mnemonic = cryptr.decrypt(wallet.vault);
                mnemonic = mnemonic.replace(/,/g, ' ');
                mnemonic = mnemonic.trim()
                return mnemonic
            } else {
                throw Error("invalid PW!")
            }
        }catch(e){
            throw e
        }
    }

    static async initClient(password) {
        if(!password) throw Error("101: password required!")
        log.debug("password: ",password)
        const cryptr = new Cryptr(password);

        //read seed from config
        let wallet = getWallet()
        wallet = JSON.parse(wallet)
        log.debug("wallet: ",wallet)

        //validate pw
        let isValid = bcrypt.compareSync(password, wallet.hash); // true
        if(!isValid) {
            return false
        } else{
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
                    ETH_BALANCE = balance
                } else {
                    console.error(error,result)
                }
            });

            let ABI = abiInfo.ABI;
            let metaData = abiInfo.metaData;


            //
            let contract = new web3.eth.Contract(ABI,metaData.contractAddress)
            console.log("contract: ",contract);

            //let contract = abiInterface.at(metaData.contractAddress);
            let balance = await contract.methods.balanceOf(MASTER_ADDRESS).call()
            console.log("balance: ",balance);
            FOMO_BALANCE = balance/metaData.BASE;
            online = true

            //get past events
            contract.getPastEvents('Transfer', {
                // Using an array means OR: e.g. 20 or 23
                fromBlock: 0,
                toBlock: 'latest'
            }, function(error, events){  })
                .then(function(events){
                    log.debug(events) // same results as the optional callback above

                    //for each
                    for(let i = 0; i < events.length; i++){
                        let event = events[i]
                        log.info("event: ",event)
                        //push events to message bus
                        let txInfo = {}
                        txInfo.contractAddress = event.address
                        txInfo.confirmed = true
                        txInfo.blockHash = event.blockHash
                        txInfo.blockNumber = event.blockNumber
                        txInfo.from = event.returnValues.from
                        txInfo.to = event.returnValues.to
                        txInfo.amount = event.returnValues.value / 100000000
                        txInfo.txid = event.transactionHash
                        txInfo.index = event.transactionIndex


                        txInfo.to = txInfo.to.toLowerCase()
                        txInfo.from = txInfo.from.toLowerCase()
                        MASTER_ADDRESS = MASTER_ADDRESS.toLowerCase()

                        log.debug("event: ",txInfo)
                        if(txInfo.to == MASTER_ADDRESS || txInfo.from == MASTER_ADDRESS){
                            //
                            TXS_ALL.push(txInfo)
                        }
                        //TXS_ALL.push(txInfo)
                    }

                });
            return true
        }
    }

    static async getSummaryInfo() {
        let output = {
            online,
            address:MASTER_ADDRESS,
            ethBalance:ETH_BALANCE,
            balance:FOMO_BALANCE,
            txs:TXS_ALL
        }

        //set globals?
        return output
    }

    static subscribeToPayments() {
        //get balance?

        //set globals?
    }

    static async send(address,amount) {
        let tag = " | SEND | "
        amount = amount * abiInfo.metaData.BASE
        if(!MASTER_PRIVATE) throw Error("102: wallet not innitialized")
        log.debug("MASTER_PRIVATE: ",MASTER_PRIVATE)
        let fromAddress = MASTER_ADDRESS

        let priv = ethUtils.toBuffer(MASTER_PRIVATE)
        log.debug(tag,"privKey: ",priv)
        log.debug(tag,"fromAddress: ",fromAddress)
        log.debug(tag,"priv: ",priv)

        let nonce = await web3.eth.getTransactionCount(fromAddress,'pending')

        let to_address = address

        //let abiInfo = require("../coins/"+coin.toUpperCase()+".abi.js")
        let ABI = abiInfo.ABI
        let metaData = abiInfo.metaData
        let contract = new web3.eth.Contract(ABI,metaData.contractAddress);

        let gas_limit = 240000
        log.debug(tag,"gas_limit: ",gas_limit)

        let transfer_data = contract.methods.transfer(to_address, amount).encodeABI();

        let gas_price = await web3.eth.getGasPrice()
        log.debug(tag,"gas_price: ",gas_price)
        gas_price = parseInt(gas_price)

        //let gas_price = 20000000
        let rawTx = {
            nonce: nonce,
            to: metaData.contractAddress,
            gasPrice: gas_price,
            data: transfer_data,
            gasLimit : gas_limit
        }
        log.debug(tag,"rawTx: ",rawTx)
        let transaction = new TX(rawTx)
        transaction.sign(priv)
        let serializeTx = transaction.serialize()
        let txid = await web3.eth.sendSignedTransaction('0x' + serializeTx.toString('hex')).on('transactionHash', function(txid){
            log.debug("TXID: ",txid)
            return txid
        }).on('receipt', console.log)
        return txid
    }
}


export default WalletService
