/*
    Fomobot Core Class
        Highlander

 */

const TAG  = " | FOMOBOT | "
let VERSION = 0.01

//import {train,init} from "./train"
//let train = require("./train")

class BotService {

    static getVersion(){
        return VERSION
    }

    static async initClient() {
        let tag = TAG + " | initClient | "
        try{
            //train.train()
            //
            //train.train()
            return "Wuddup"
        }catch(e){
            console.error(tag,e)
            throw e
        }
    }

}

export default BotService
