/*
    CoinCap  API
            - Highlander

 */

const TAG = " | fomo-coincap-api-client | "
require('dotenv').config()
const log = require('default-logger')()
const https = require('https');
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const URL = "https://api.coincap.io/v2/"

module.exports = {
    assets:function(){
        return get_assets()
    },
    history:function(asset,interval,start,end){
        return get_asset_history(asset,interval,start,end)
    },
}


/****************************************************
 // Coincap Endpoints
 //****************************************************/


let get_assets = async function () {
    let tag = TAG + ' | get_order | '
    try {

        let url = URL + 'assets'
        log.info(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        log.info('result: ', result.data)

        return result.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_asset_history = async function (asset,interval,start,end) {
    let tag = TAG + ' | get_asset_history | '
    try {
        let interval = 'h1'

        //get now
        if(!end) end = new Date().getTime()
        //let 24 ago
        if(!start) start = end - 1000 * 60 * 60 * 24

        if(!interval) interval

        let url = URL + 'assets/'+asset+'/history?interval='+interval+'&start='+start+'&end='+end
        log.info(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        log.info('result: ', result.data)

        return result.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}
