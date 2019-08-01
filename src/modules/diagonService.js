/*
    DiagonAlley.io
        Client Side Module


    General
        * register



 */

const TAG = " | SERVICE | "
const rp = require("request-promise-native")
const harryPotterNames = require('harry-potter-names')
require('dotenv').config()
const https = require('https')
const Axios = require('axios')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})
const bitcoin = require('bitcoinjs-lib') // v3.x.x
//const networks = require('bitcoinjs-lib').networks
const bitcoinMessage = require('bitcoinjs-message')

let URL_BASE
if(process.env.NODE_ENV === "development"){
    URL_BASE = process.env.VUE_APP_SERVICE_HOSTNAME || "https://diagonalley.io"
} else {
    URL_BASE = "https://diagonAlley.io"
}


let generateUsername = async function() {
    let newUser = harryPotterNames.random()
    if (newUser.indexOf(")") >= 0) newUser = harryPotterNames.random()
    newUser = newUser.replace(/ /g, '_');
    return newUser
}


let isValid = async function (username) {
    try {
        let output

        let url = URL_BASE + '/user/'+username
        let result = await send_get_request(url)

        output = result.isAvailable
        return output
    } catch (error) {
        return error
    }
}


let register = async function (username,signingPub,signingPriv) {
    let tag = TAG + " | register | "
    try {

        console.log(tag,"Checkpoint1")
	    console.log(tag,"username: ",username)
        let url = URL_BASE + '/register'

        let payload = {}
        payload.username = username

        let signature = await signMessage(signingPub, JSON.stringify(payload),signingPriv)
        console.log(tag,"signature: ",signature)

        let body = {
            account: signingPub,
            payload,
            signature
        }
	    console.log(tag,"body: ",body)



        let output = await sendPostRequest(url,body)

        return output
    } catch (error) {
        return error
    }
}

//TODO transfer


let send_get_request = async function (url) {
    let debug = true
    try {
        if (debug) console.log('url: ', url)
        let result = await axios({
            url: url,
            method: 'GET'
        })
        if (debug) console.log('result: ', result.data)

        //todo validate
        return result.data
    } catch (e) {
        // magic to decode error code
        let errorCode = e.message.replace(' - ""', '')
        let errorMessage = e.message
        if (errorCode === '401') {
            throw Error('102: Misconfiguration! invalid api secret!')
        } else if (errorMessage.indexOf('ECONNREFUSED') >= 0) {
            throw Error('103: client not running! nothing on ip:port ' + process.env['GRIN_IP'] + ':' + process.env['GRIN_PORT_NODE'])
        } else {
            console.error('e', e)
            throw Error('999: Unknown Error: ' + e.message)
        }
    }
}

let sendPostRequest = async function (url,body) {
    let tag = TAG + " | send_post_request | "
    try {
        //url = "http://" + process.env.GRIN_USERNAME + ":" + process.env.GRIN_PASSWORD + "@" + url
        console.log(tag,"url: ",url)


        let options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true // Automatically stratifies the body to JSON
        };

        let result = await rp(options)
        console.log(result)
        return result
    } catch (e) {
        let errorCode = e.message.replace(' - ""','')
        errorCode = errorCode.split("-")
        console.error(tag,"errorCode: ",errorCode)
        let errorMessage = e.message
        errorCode = errorCode[0].trim()
        console.error(tag,"errorCode: ",errorCode)
        console.error(tag,"errorMessage: ",errorMessage)
        if(errorCode === '401'){
            throw Error("102: Missconfiguration! invalid api secret!")
        }else if (errorCode === '500' && errorMessage.indexOf("Client Callback Error: Posting transaction slate") >= 0) {
            throw Error("102: invalid slate!")
        } else {
            console.error('e', e)
            throw Error("999: Unknown Error: " + e.message)
        }
    }
}

var signMessage = async function(address,msg,privKey) {
    let tag = TAG + " | sign_message | "
    try {
        let testnet= false
        if(typeof(msg) !== 'string') msg = JSON.stringify(msg)
        console.log(tag, "address: ", address)
        console.log(tag, "msg: ", msg)
        console.log(tag, "privKey: ", privKey)
        if(!address) throw Error("104: missing address!")
        if(!msg) throw Error("105: missing msg!")
        //console.log(tag,"coin: ",coin)

        if (!privKey) privKey = PRIVKEY
        if (!privKey) throw Error("101: unable to sign! no privKey!")
        console.log(tag, 'privKey: ', privKey)
        //console.log(tag,'testnet: ',networks.testnet)
        //console.log(tag,'testnet: ',networks)
        // var keyPair = bitcoin.ECPair.fromWIF(privKey,networks.testnet)



        const networks = require('bitcoinjs-lib').networks
        let keyPair
        if(testnet){
            console.log("testnet detected")
            keyPair = bitcoin.ECPair.fromWIF(privKey, networks.testnet)
        } else {
            console.log("mainnet detected")
            keyPair = bitcoin.ECPair.fromWIF(privKey)
        }
        var privateKey = keyPair.d.toBuffer(32)
        if (!privateKey) throw Error("106: unable to build privkey buffer!")
        var message = msg

        var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
        if (!signature) throw Error("107: unable to build signature!")
        return signature.toString('base64')

    } catch (e) {
        console.error(tag, "Error: ", e)
        throw e
    }
}


export default {
    generateUsername,
    isValid,
    register,
    signMessage
}

//module.exports = ({generateUsername,isValid,register})