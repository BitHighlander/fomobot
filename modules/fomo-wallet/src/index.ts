const bip39 = require('bip39');
const HDKey = require('hdkey');
const CoinKey = require('coinkey');
const coininfo = require('coininfo');

// import HDKey from 'hdkey'
// import CoinKey from 'coinkey'
// import ethUtils from 'ethereumjs-util'
// import bitcoinMessage from 'bitcoinjs-message'
// import bitcoin from 'bitcoinjs-lib'
// import { API_HOST } from '../config'
// import coininfo from 'coininfo'

// let IS_TESTNET = process.env.REACT_APP_IS_TESTNET
// if(IS_TESTNET === 'false') IS_TESTNET = false


let onGetNewSeed = async function () {
    try {
        //this.setState({ error: null });
        let seed = await bip39.generateMnemonic();

        let success = true;

        let output = {success,seed};
        return output
    } catch (error) {
        return error
    }
};

let onBuildWallet = async function (seed:string) {
    try {
        let testnet = false;
        seed = seed.trim();
        if(!seed) throw Error("empty seed");
        if(seed.length < 10 ) throw Error("bad seed seed");
        //derive account address

        let bufferSeed = await bip39.mnemonicToSeed(seed);

        let path = "m";

        let mkForSigning = HDKey.fromMasterSeed(bufferSeed);

        let childkeyForSigning = mkForSigning.derive(path);

        let keyForSigning;
        if(!testnet) {
            keyForSigning = new CoinKey(childkeyForSigning.privateKey)
        } else {
            keyForSigning = new CoinKey(childkeyForSigning.privateKey, coininfo('BTC-TEST').versions)
        }

        let wallet = {
            account:keyForSigning.publicAddress,
            apiKey:keyForSigning.privateWif,
        };
        //console.log(" | onBuildWallet | wallet: ",wallet)

        return wallet
    } catch (error) {
        return error
    }
};



module.exports = ({onBuildWallet,onGetNewSeed});
// export default {onBuildWallet,onGetNewSeed}