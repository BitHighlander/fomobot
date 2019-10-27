
/*

        Binance trade module

        Goals:
            Full audibility on trades and balances.
            buffering dust and small trade handleing


        Tests:
            Reports balances
            place limit
            report trade events

 */
require('dotenv').config({path: '../../.env'});
//require('dotenv').config();

const config = require("../config.js")

//const log = require('loggerdog-client')()
//let { btc } = require('../modules/daemons-manager')
let log = {debug:console.log,info:console.log}

const pause = function(length){
    return new Promise(function(resolve, reject) {
        var done = function(){resolve(true)}
        setTimeout(done,length*1000)
    })
}



//Test module
const client = require("../index.js")

describe(' - Signing module - ', () => {

    //MAINNET
    let addressTEST = "1FyLxqKCvzZXUxQg3hfVZ9zDCv14q8iZnR"
    let privKeyTEST = "L4U5NYpXvtSoZdCGXJGYesGsYrBKQg41giT4sUkiL18x6utMyGid"
    let testMessage = "Bitcoin Cash is Bitcoin"
    let knownSigature = "IK5FICks3K9jfUCPJ5WiZngpN6US3vIQrpy3PuO33tPVcBczYbJzrdzjQR5bQbdoMHbCrwIGKAXwWx/YfI5S3GU="

    //TESTNET
    // let addressTEST = "1FyLxqKCvzZXUxQg3hfVZ9zDCv14q8iZnR"
    // let privKeyTEST = "cPBn5A4ikZvBTQ8D7NnvHZYCAxzDZ5Z2TSGW2LkyPiLxqYaJPBW4"
    // let testMessage = 'hello, world'
    // let knownSigature = "H/DIn8uA1scAuKLlCx+/9LnAcJtwQQ0PmcPrJUq90aboLv3fH5fFvY+vmbfOSFEtGarznYli6ShPr9RXwY9UrIY="

    test.skip('configs is required correctly', async () => {


    })

    test.skip(' Signs valid with MAINNET keys ', async () => {

        let result = await client.sign(addressTEST,testMessage,privKeyTEST)
        log.debug("result: ",result)
        log.debug("known: ",knownSigature)
        expect(result).toEqual(knownSigature)
    })

    test.skip(' Signs valid with TESTNET keys', async () => {

        let result = await client.sign(addressTEST,testMessage,privKeyTEST)
        log.info("result: ",result)

    })

    test.skip(' validates signatures with MAINNET keys', async () => {

        let result = await client.sign(addressTEST,testMessage,privKeyTEST)
        log.info("result: ",result)

    })

    test.skip(' validates signatures with TESTNET keys', async () => {

        let result = await client.sign(addressTEST,testMessage,privKeyTEST)
        log.info("result: ",result)

    })

})
