/**
 * Created by highlander on 4/24/16.
 */
/**
 * Created by highlander on 4/23/16.
 */
/**
 * Created by highlander on 3/18/2016.
 */
var when = require('when');
var request = require("request")

const { GraphQLClient } = require('graphql-request');
const symbolIDMap = require('./symbolIDMap');
const graphql = new GraphQLClient('https://graphql.coincap.io/');

//const config = require('../config')

let TAG = " | coincap | "

module.exports = {
    rates:async function(){
        return get_rates()
    },
    lookup:function(coin,param){
        return query_data(coin,param)
    }
}


let query_data = async function (coin,param) {
    let tag = TAG+ " | query_data | "
    let debug = true
    let debug1 = false
    try{
        let rates = await get_rates()


        return rates[coin]
    }catch(e){
        console.error(tag,"ERROR: ",e)
        throw e
    }
}

//primary
var get_rates = async function(){
    try{
        //
        let output =  {}

        let url = URL + 'assets'
        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        //parse into keys array off ticker
        let allCoinsArray = result.data.data
        log.debug(tag,"allCoinsArray: ",allCoinsArray)

        for(let i = 0; i < allCoinsArray.length; i++){
            //
            let coinInfo = allCoinsArray[i]
            log.debug(tag,"coinInfo: ",coinInfo)

            output[coinInfo.symbol] = coinInfo
        }
        log.debug('result: ', output)

        return output
    }catch(e){
        console.error(e)
        throw e
    }
}

//lib
var get_request = function(url){
    var d = when.defer()
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    var options = {
        url,
        method: 'GET',
        headers: headers
    }
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            //console.log(body)
            d.resolve(body)
        }
    })
    return d.promise;
}


var ccNotify = function(url){
    var d = when.defer()
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    var options = {
        url: url + "/front",
        method: 'GET',
        headers: headers
    }
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            //console.log(body)
            d.resolve(body)
        }
    })
    return d.promise;
}
