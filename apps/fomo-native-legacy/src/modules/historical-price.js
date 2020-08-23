
/*

    Available API
        https://api.coindesk.com/v1/bpi/historical/close.json?start=2014-09-01&end=2014-09-03

    Limits: 1 usd price PER DAY

 */

const TAG = " | Historical-price | "
let request = require('request-promise');
const log = require('dumb-lumberjack')()

//redis
const util = require('./redis')
const redis = util.redis
const publisher = util.publisher

module.exports = {
    bestPrice: function (coin,time) {
        return get_best_historical_price(coin,time)
    },
}




let get_best_historical_price = async function (coin,time) {
    let tag = TAG+" | raw_to_csv | "
    try {
        coin = coin.toUpperCase()
        if(coin !== "BTC") throw Error("101: coin not supported!")

        let cache = await redis.get(coin+":"+time)
        if(cache) {
            return cache
        } else{
            var date = new Date(time);
            log.debug(tag,'end: ',date)

            let year = date.getFullYear()
            let month = date.getMonth()
            let day = date.getDay()
            log.debug(tag,'input: ',{year,month,day})

            function str_pad(n) {
                return String("00" + n).slice(-2);
            }

            let start = year+'-'+str_pad(month+1)+'-'+str_pad(day+1)
            let end = year+'-'+str_pad(month+1)+'-'+(str_pad(day+1))
            log.debug(tag,'start: ',start)
            log.debug(tag,'end: ',end)

            var options = {
                uri: 'https://api.coindesk.com/v1/bpi/historical/close.json?start='+start+'&end='+end,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };

            let result = await request(options)


            if(result.bpi[start]){
                redis.set(coin+":"+time,result.bpi[start])
                return result.bpi[start]
            } else {
                throw Error("102: unhandled response!")
            }
        }




    } catch (e) {
        log.error(tag,"coin:",coin)
        log.error(tag,"time:",time)
        log.error(tag,e)
    }
}