/*
    CoinCap  API
            - Highlander

 */

const TAG = " | coincap-api-client | "
require('dotenv').config()
const log = require('@fomobro/loggerdog-client')()
const https = require('https');
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const { GraphQLClient } = require('graphql-request');
const symbolIDMap = require('./symbolIDMap');

const graphql = new GraphQLClient('https://graphql.coincap.io/',{
    headers: {
        "x-coincap-bypass-limit": process.env['BYPASS_RATE_LIMIT_KEY'],
    }
});

const URL = "https://api.coincap.io/v2/"

let ENABLE_CACHE = true
let GLOBAL_RATES

// let onStart = async function(){
//     let tag = TAG + " | onStart | "
//     try{
//         let rates = await get_assets()
//         GLOBAL_RATES = rates
//     }catch(e){
//         console.error(e)
//     }
// }
// onStart()


module.exports = {
    assets:function(){
        return get_assets()
    },
    history:function(asset,interval,start,end){
        return get_asset_history(asset,interval,start,end)
    },
    valuePortfolio:function(portfolio,quote){
        return get_value_portfolio(portfolio,quote)
    },
    getPrice:function(asset){
        return get_asset_price(asset)
    },
    getPriceIn:function(asset,quote){
        return get_asset_price_in_quote(asset,quote)
    },
    getValue:function(asset,amount){
        return get_asset_value(asset,amount)
    },
}


let get_value_portfolio = async function (portfolio,quote) {
    let tag = TAG + ' | get_value_portfolio | '
    try {
        //
        if(!GLOBAL_RATES) GLOBAL_RATES = await get_assets()

        let coins = Object.keys(portfolio)

        let valuesUsd = {}
        let totalValueUsd = 0
        for(let i = 0; i < coins.length; i++){
            let coin = coins[i]
            //log.debug(tag,"coin: ",coin)
            if(!GLOBAL_RATES[coin] || !GLOBAL_RATES[coin].priceUsd){
                log.error(tag," Missing rate data for "+coin)
                GLOBAL_RATES[coin] = {}
                GLOBAL_RATES[coin].priceUsd = 0
            }
            let rateUsd = GLOBAL_RATES[coin].priceUsd
            log.debug(coin," rateUsD: ",rateUsd)
            valuesUsd[coin] = portfolio[coin] * parseFloat(rateUsd)
            totalValueUsd += valuesUsd[coin]

            //TODO if quote !== USD
            //calc conversion
        }

        return {values:valuesUsd,total:totalValueUsd}
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_asset_value = async function (asset,amount) {
    let tag = TAG + ' | get_asset_history | '
    try {
        let id = await getIDForSymbol(asset)
        if(!id) throw Error("102: unknown id for asset: "+asset)
        log.debug(tag,"id: ",id)

        let marketInfo = await getMarketDataForIDs([id])

        if(!marketInfo.assets.edges[0]) throw Error("103: unknown market info for asset! asset: "+asset)
        let priceUsd = marketInfo.assets.edges[0].node.priceUsd

        let value = parseFloat(amount) * parseFloat(priceUsd)

        return value
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

//lib
let get_asset_price = async function (asset) {
    let tag = TAG + ' | get_asset_history | '
    try {
        let id = await getIDForSymbol(asset)
        log.info(tag,"id: ",id)

        let marketInfo = await getMarketDataForIDs([id])

        return marketInfo.assets.edges[0].node
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

//
const getMarketDataForIDs = async (ids) => {
    const query = /* GraphQL */ `
    {
      assets(first: ${ids.length}, where: {
        id_in: ${JSON.stringify(ids)}
      }) {
        edges {
          node {
            id,
            symbol,
            priceUsd,
            changePercent24Hr
          }
        }
      }
    }`;

    return await graphql.request(query);
}

const getIDForSymbol = async (symbol) => {
    try {
        const query = `{
      assets(
        first: 1, 
        where: {
          symbol_starts_with: "${symbol}"
        }, 
        sort: rank, 
        direction: ASC) 
      {
        edges {
          node {
            id,
          }
        }
      }
    }`;

        const ret = await graphql.request(query);
        const ID = ret.assets.edges[0].node.id;
        // Cache
        symbolIDMap[symbol] = ID;
        return ID;

    } catch (err) {
        return symbol;
    }
}

const getMarketDataForSymbols = async (symbols) => {
    let ids = symbols.map(symbol => {
        return symbolIDMap[symbol] !== undefined ?
            symbolIDMap[symbol] :
            getIDForSymbol(symbol);
    });
    ids = await Promise.all(ids);
    const ret = await getMarketDataForIDs(ids);
    const marketDatas = ret.assets.edges.map(edge => edge.node);
    return marketDatas;
}

getHistoryForSymbol = async (symbol) => {
    const id = await getIDForSymbol(symbol);

    const query = /* GraphQL */ `
  {
    assetHistories(assetId: "${id}" interval: h1, limit: 24)
    {
      priceUsd,
      date,
      timestamp
    }
  }`;

    const ret = await graphql.request(query);
    return ret.assetHistories;
}


/****************************************************
 // Coincap Endpoints
 //****************************************************/


let get_assets = async function () {
    let tag = TAG + ' | get_order | '
    try {
        let output =  {}

        let url = URL + 'assets?limit=2000'
        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        //parse into keys array off ticker
        let allCoinsArray = result.data.data
        log.info(tag,"allCoinsArray: ",allCoinsArray.length)

        for(let i = 0; i < allCoinsArray.length; i++){
            //
            let coinInfo = allCoinsArray[i]
            log.debug(tag,"coinInfo: ",coinInfo)

            output[coinInfo.symbol] = coinInfo
        }
        log.debug('result: ', output)

        return output
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
        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        log.debug('result: ', result.data)

        return result.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}
