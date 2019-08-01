/*

     Just the Basics

        BTC address signing and Message  validation
                - Highlander

 */

import bip39 from 'bip39'
import HDKey from 'hdkey'
import CoinKey from 'coinkey'
import coininfo from 'coininfo'


let IS_TESTNET = process.env.REACT_APP_IS_TESTNET
if(IS_TESTNET === 'false') IS_TESTNET = false


let onGetNewSeed = async function () {
    try {
        //this.setState({ error: null });
        let seed = await bip39.generateMnemonic()

        let success = true

        let output = {success,seed}
        return output
    } catch (error) {
        return error
    }
};


let onBuildWallet = async function (seed) {
    try {
        let testnet = IS_TESTNET
        console.log("seed: ",seed)
        console.log("seed: ",typeof(seed))
        console.log("testnet: ",testnet)
        seed = seed.trim()
        if(!seed) throw Error("empty seed")
        if(seed.length < 10 ) throw Error("bad seed seed")
        //derive account address
        let bufferSeed
        let mk

        bufferSeed = bip39.mnemonicToSeed(seed)

        //try to convery seed to buffer
        // try{
        //     bufferSeed = new Buffer.from(seed, 'hex')
        // }catch(e){
        //     console.error("unable to create buffer from seed! ",seed)
        //     console.error("unable to create buffer from seed! ",e)
        //     let seed2 = await bip39.generateMnemonic()
        //     bufferSeed = new Buffer.from(seed2,'hex')
        // }

        try{
            if(!testnet) {
                console.log("Building mainnet keypair")
                mk = HDKey.fromMasterSeed(bufferSeed)
            } else {
                console.log("Building testnet keypair")
                mk = HDKey.fromMasterSeed(bufferSeed, coininfo('bitcoin-test').versions.bip32)
            }
        }catch(e){
            console.error("unable to create key from seed! ",seed)
            console.error("unable to create key from seed! ",e)
        }


        let path = "m"
        let childkey = mk.derive(path)

        //path Main
        let coin_type = testnet ? 1 : 0
        //let coin_type = 0
        let index = 0  // <-- modify this if you want different keys for different orders

        let pathMain = "m/44'/"+coin_type+"'/0'/0/"+index
        let childkey2 = mk.derive(pathMain)

        //FOR SIGNING we always use btc MAINnet

        let mkForSigning = HDKey.fromMasterSeed(bufferSeed)

        let childkeyForSigning = mkForSigning.derive(path)

        let keyForSigning
        if(!testnet) {
            keyForSigning = new CoinKey(childkeyForSigning.privateKey)
        } else {
            keyForSigning = new CoinKey(childkeyForSigning.privateKey, coininfo('BTC-TEST').versions)
        }

        console.log("keyForSigning: ",keyForSigning)
        //keyForSigning.versions = coininfo('BTC-TEST')


        // var key = new CoinKey(childkey.privateKey)
        // var keyM = new CoinKey(childkey2.privateKey)
        if(!testnet){
            var key = new CoinKey(childkey.privateKey)
            var keyM = new CoinKey(childkey2.privateKey)
        } else {
            var key =new CoinKey(childkey.privateKey, coininfo('BTC-TEST').versions)
            var keyM =new CoinKey(childkey2.privateKey, coininfo('BTC-TEST').versions)
        }



        let wallet = {
            signingPub:keyForSigning.publicAddress,
            signingPriv:keyForSigning.privateWif,

        }
        console.log(" | onBuildWallet | wallet: ",wallet)

        return wallet
    } catch (error) {
        return error
    }
};

// Signing
// let sign_message = async function(address,msg,privKey) {
//     let tag = TAG + " | sign_message | "
//     try {
//         log.info(tag, "address: ", address)
//         log.info(tag, "msg: ", msg)
//         log.info(tag, "privKey: ", privKey)
//
//         if (!privKey) privKey = PRIVKEY
//         if (!privKey) throw Error("101: unable to sign! no privKey!")
//         log.info(tag, 'privKey: ', privKey)
//
//         const networks = require('bitcoinjs-lib').networks
//         let keyPair
//         if(TESTNET){
//             keyPair = bitcoin.ECPair.fromWIF(privKey, networks.testnet)
//         } else {
//             keyPair = bitcoin.ECPair.fromWIF(privKey)
//         }
//
//         let message = msg
//
//         let signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)
//         return signature.toString('base64')
//
//     } catch (e) {
//         console.error(tag, "Error: ", e)
//         throw e
//     }
// }


export default {onBuildWallet,onGetNewSeed}
