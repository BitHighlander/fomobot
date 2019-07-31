
const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')

const config = require('./config.js')
const log = require('dumb-lumberjack')()
const TAG = " | Signing module | "
module.exports = {
    sign: function (address,msg,privKey) {
        return sign_message(address,msg,privKey);
    },
    verifyMessage: function (address,sig,msg) {
        return bitcoinMessage.verify(msg, address, sig);
    }
}

var sign_message = async function(address,msg,privKey){
    let tag = TAG+" | sign_message | "
    try{
        log.debug(tag,"msg: ",msg)
        log.debug(tag,"msg: ",msg)
        log.debug(tag,"privKey: ",privKey)

        if(!privKey) privKey = process.env['BTC_SIGNING_PRIVKEY']
        if(!privKey) throw Error("101: unable to sign! no privKey!")
        log.debug(tag,'privKey: ',privKey)

        var keyPair = bitcoin.ECPair.fromWIF(privKey)
        var privateKey = keyPair.d.toBuffer(32)
        var message = msg

        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
        return signature.toString('base64')

    }catch(e){
        console.error(tag,"Error: ",e)
        throw e
    }
}


// var verify_signature = function(address,msg,sig){
//     let tag = " | sign_message | "
//     let debug = false
//     try{
//
//         var keyPair = bitcoin.ECPair.fromWIF()
//         var privateKey = keyPair.d.toBuffer(32)
//         var message = 'This is an example of a signed message.'
//         var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
//         log.debug(signature.toString('base64'))
//
//         return signature
//     }catch(e){
//         console.error(tag,"Error: ",e)
//         throw "ERROR:100 Unable to Start ETH client"
//     }
// }
