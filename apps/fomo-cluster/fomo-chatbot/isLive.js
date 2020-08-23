/*
    Liveness probe G1

    Goals:
        *


 */
const TAG = " | liveness | "
require("dotenv").config({path:'./../../.env'})
const log = require('@fomobro/loggerdog-client')()
//let network = require("@fomobromonero-network")
//network.init('full')
//const find = require('find-process');

const check_liveness = async function(){
    let tag = TAG + " | check_liveness | "
    try{
        // let processes = await find('port','8000')
        // log.debug(tag,"processes: ",processes)
        // //if something running
        //
        // if(processes.length > 0){
        //     log.debug(tag," SERVICE IS LIVE!")
        //     process.exit(0)
        // }

        process.exit(0)
    }catch(e){
        log.error(tag,"error: ",e)
        process.exit(1)
    }
}
check_liveness()
