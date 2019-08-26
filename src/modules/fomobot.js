/*
    Fomobot Core Class
        Highlander

 */

const TAG  = " | FOMOBOT | "
let VERSION = 0.01

//import {train,init} from "./train"
//let train = require("./train")
import { BitmexAPI } from "bitmex-node";
import log from './logger'
import {getConfig} from './config'

const Cryptr = require('cryptr');

let IS_INIT = false

let EXCHANGES = {}
let BALANCES = []

class BotService {

    static getVersion(){
        return VERSION
    }

    static async initClient(password) {
        let tag = TAG + " | initClient | "
        try{
            if(!IS_INIT){
                let config = getConfig()
                if(!config.bitmexTest) throw Error("Bitmex not configured!")
                if(!password) throw Error("Password required!")

                //decrypt priv
                let encryptedPriv = config.bitMexTestPriv
                const cryptr = new Cryptr(password);
                let priv = cryptr.decrypt(encryptedPriv)
                let pub = config.bitmexTestPub

                log.debug("pub: ",pub)
                log.debug("priv: ",priv)

                //
                if(!pub) throw Error("missing pub! ")
                if(!priv) throw Error("missing priv! ")

                EXCHANGES['bitmex'] = new BitmexAPI({
                    "apiKeyID": pub,
                    "apiKeySecret": priv,
                    "testnet":true
                    // "proxy": "https://cors-anywhere.herokuapp.com/"
                })

                //get balances
                let wallet = await bitmex.User.getWallet()
                log.debug("wallet: ", wallet)
                IS_INIT = true
            }

            return true
        }catch(e){
            console.error(tag,e)
            throw e
        }
    }

    static async getSummaryInfo() {
        let output = {
            online:IS_INIT,
            BALANCES,
        }

        //set globals?
        return output
    }

}

export default BotService
