/*
    Pioneer
        * A multi-coin multi-purpose concurrency lib

 */

const TAG = " | Pioneer | ";

const bip39 = require(`bip39`);
const bip32 = require(`bip32`);
const bech32 = require(`bech32`);
const secp256k1 = require(`secp256k1`);
const sha256 = require("crypto-js/sha256");
const ripemd160 = require("crypto-js/ripemd160");
const CryptoJS = require("crypto-js");
const HDKey = require("hdkey");
let bitcoin = require("bitcoinjs-lib");
var b58 = require("bs58check");
const BIP84 = require("bip84");
const ethUtils = require("ethereumjs-util");

/**********************************
 // Module
 //**********************************/

enum COIN_SUPPORT_ENUM {
  ETH,
  BTC,
  BCH,
  DASH,
  DGB,
  DOGE,
  LTC,
  RDD,
  ATOM,
}

const COIN_SUPPORT = ["ETH", "BTC", "BCH", "DASH", "DGB", "DOGE", "LTC", "RDD"];

const supportedCoins = [
  "Bitcoin",
  "Testnet",
  "BitcoinCash",
  "BitcoinGold",
  "Litecoin",
  "Dash",
  "DigiByte",
  "Dogecoin",
];

const segwitCoins = ["Bitcoin", "Testnet", "BitcoinGold", "Litecoin"];

const COIN_MAP: any = {
  BTC: "Bitcoin",
  BTCT: "Testnet",
  ETH: "Ethereum",
  BCH: "BitcoinCash",
  LTC: "Litecoin",
  DASH: "Dash",
  DGB: "DigiByte",
  DOGE: "Dogecoin",
  ATOM: "Cosmos",
};

const SLIP_44: any = {
  ETH: 118,
  BTC: 0,
  BCH: 145,
  LTC: 2,
  DOGE: 3,
  RDD: 4,
  DASH: 5,
  DGB: 20,
};

const NETWORKS: any = {
  btc: {
    messagePrefix: "\x18Bitcoin Signed Message:\n",
    bech32: "bc",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  bch: {
    messagePrefix: "\x18Bitcoin Cash Signed Message:\n",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  test: {
    messagePrefix: "\x18Bitcoin Signed Message:\n",
    bech32: "tb",
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  },
  ltc: {
    messagePrefix: "\x19Litecoin Signed Message:\n",
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  },
  doge: {
    messagePrefix: "\x19Dogecoin Signed Message:\n",
    bip32: {
      public: 0x02fd3929,
      private: 0x02fd3955,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
  },
  dash: {
    messagePrefix: "unused",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
  },
  dgb: {
    messagePrefix: "\x18DigiByte Signed Message:\n",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x3f,
    wif: 0x80,
  },
  rdd: {
    messagePrefix: "\x18Reddcoin Signed Message:\n",
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3d,
    scriptHash: 0x05,
    wif: 0xbd,
  },
};

// TYPES
interface CoinInfo {
  coin: string;
  master: string;
  publicKey: string;
  long: string;
  xpub: string;
  zpub?: string;
}

interface Wallet {
  coins: {
    [index: string]: CoinInfo;
  };
}

// All known xyx... pub formats
const prefixes: any = new Map([
  ["xpub", "0488b21e"],
  ["ypub", "049d7cb2"],
  ["Ypub", "0295b43f"],
  ["zpub", "04b24746"],
  ["Zpub", "02aa7ed3"],
  ["tpub", "043587cf"],
  ["upub", "044a5262"],
  ["Upub", "024289ef"],
  ["vpub", "045f1cf6"],
  ["Vpub", "02575483"],
]);

enum AddressTypes {
  "bech32",
  "legacy",
}

//innit
export async function xpubConvert(xpub: string, target: string) {
  let tag = TAG + " | importConfig | ";
  try {
    //
    if (!prefixes.has(target)) {
      return "Invalid target version";
    }

    // trim whitespace
    xpub = xpub.trim();

    var data = b58.decode(xpub);
    data = data.slice(4);
    data = Buffer.concat([Buffer.from(prefixes.get(target), "hex"), data]);
    return b58.encode(data);
  } catch (e) {
    console.error(tag, "e: ", e);
    throw e;
  }
}

export async function generateWalletFromSeed(mnemonic: string) {
  let tag = TAG + " | importConfig | ";
  try {
    //
    let output: Wallet = {
      coins: {},
    };
    //for each coin
    for (let i = 0; i < COIN_SUPPORT.length; i++) {
      let coin = COIN_SUPPORT[i];

      let path = "m/44'/" + SLIP_44[coin] + "'/0'";

      const { masterKey, xpub } = await deriveMasterKey(mnemonic, path);
      //
      const { privateKey, publicKey } = deriveKeypair(masterKey, path);
      //const bnbAddress = createBNBAddress(publicKey)

      // let master = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0)
      let addressMaster: string = "";

      if (coin === "BTC") {
        let { address: address } = bitcoin.payments.p2wpkh({
          pubkey: publicKey,
          network: NETWORKS[coin.toLowerCase()],
        });
        addressMaster = address;
      } else if (coin === "ETH") {
        var address;
        address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey, true));
        addressMaster = address;
      } else {
        let { address: address } = bitcoin.payments.p2pkh({
          pubkey: publicKey,
          network: NETWORKS[coin.toLowerCase()],
        });
        addressMaster = address;
      }

      console.log(addressMaster);
      let coinInfo: CoinInfo = {
        coin,
        long: COIN_MAP[coin],
        master: addressMaster,
        publicKey: publicKey.toString(`hex`),
        xpub,
      };

      if (coin === "BTC") {
        let root = new BIP84.fromSeed(mnemonic);
        let child0 = root.deriveAccount(0);
        let account0 = new BIP84.fromZPrv(child0);
        let zpub = account0.getAccountPublicKey();
        coinInfo.zpub = zpub;
      }

      console.log({ coinInfo });
      output.coins[coin] = coinInfo;
    }

    return output;
  } catch (e) {
    console.error(tag, "e: ", e);
    throw e;
  }
}

export async function generatePubkey(coin: string, xpub: string, path: string) {
  let tag = TAG + " | importConfig | ";
  try {
    let publicKey;
    if (coin === "BTC") {
      //TODO we need flexable paths!
      //publicKey = bitcoin.bip32.fromBase58(xpub).derivePath(path).publicKey

      //notice assumes index wtf
      publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).publicKey;
    } else if (coin === "ETH") {
      publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).publicKey;
    } else {
      //assume bitcoinish?
      //TODO fixme
      //publicKey = bitcoin.bip32.fromBase58(xpub).derivePath(path).publicKey

      publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).publicKey;
    }

    //console.log("publicKey: ",publicKey)
    return publicKey.toString(`hex`);
  } catch (e) {
    console.error(tag, "e: ", e);
    throw e;
  }
}

export async function generateAddress(coin: string, pubkey: any, type: any) {
  let tag = TAG + " | importConfig | ";
  try {
    let output: any;
    switch (coin) {
      case "BTC":
        //if no type default to bech32
        if (!type) type = "bech32";

        if (type === "bech32") {
          const { address } = bitcoin.payments.p2wpkh({
            pubkey: Buffer.from(pubkey, "hex"),
          });
          output = address;
        } else if (type === "legacy") {
          const { address } = bitcoin.payments.p2pkh({
            pubkey: Buffer.from(pubkey, "hex"),
          });
          output = address;
        }

        break;
      case "ETH":
        //
        let addressETH = ethUtils.bufferToHex(
          ethUtils.pubToAddress(Buffer.from(pubkey, "hex"), true)
        );
        output = addressETH;
        break;
      case "ATOM":
        //
        const message = CryptoJS.enc.Hex.parse(pubkey.toString(`hex`));
        const hash = ripemd160(sha256(message)).toString();
        const addressCosmos = Buffer.from(hash, `hex`);
        const cosmosAddress = bech32ify(addressCosmos, `cosmos`);
        output = cosmosAddress;
        break;
      default:
        if (!NETWORKS[coin.toLowerCase()])
          throw Error("103: unknown coin, no network found! coin: " + coin);
        const { address } = bitcoin.payments.p2pkh({
          pubkey: Buffer.from(pubkey, "hex"),
          network: NETWORKS[coin.toLowerCase()],
        });

        output = address;
        break;
    }
    return output;
  } catch (e) {
    console.error(tag, "e: ", e);
    throw e;
  }
}

export async function generateSeed() {
  let tag = TAG + " | importConfig | ";
  try {
      let randomBytesFunc = standardRandomBytesFunc
      const randomBytes = Buffer.from(randomBytesFunc(32), `hex`)
      if (randomBytes.length !== 32) throw Error(`Entropy has incorrect length`)
      const mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`))
      return mnemonic
  } catch (e) {
    console.error(tag, "e: ", e);
    throw e;
  }
}

//
// module.exports = {
//     xpubConvert: async function (xpub:string,target:string) {
//         if (!prefixes.has(target)) {
//             return "Invalid target version";
//         }
//
//         // trim whitespace
//         xpub = xpub.trim();
//
//         var data = b58.decode(xpub);
//         data = data.slice(4);
//         data = Buffer.concat([Buffer.from(prefixes.get(target),'hex'), data]);
//         return b58.encode(data);
//     },
//     generateAddressZpub: async function (zpub:string,index:number,isChange:boolean,type:string) {
//         var account1 = new BIP84.fromZPub(zpub)
//         let address = account1.getAddress(index,isChange)
//         return address
//     },
//     generatePubkey: async function (xpub:string,index:number,isChange:boolean,type:string) {
//         let account = 1
//         //if(isChange) account = 0
//         let publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).derive(index).publicKey
//         //console.log("publicKey: ",publicKey)
//         return publicKey.toString(`hex`)
//     },
//     generateAddress: async function (coin:string,pubkey:any,type:any) {
//         //
//         let output:any
//
//         switch(coin) {
//             case 'BTC':
//                 //if no type default to bech32
//                 if(!type) type = 'bech32'
//
//                 if(type === 'bech32'){
//                     const { address } = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(pubkey,'hex') });
//                     output = address
//                 } else if(type === 'legacy'){
//                     const { address } = bitcoin.payments.p2pkh({ pubkey: Buffer.from(pubkey,'hex') });
//                     output = address
//                 }
//
//                 break;
//             default:
//
//                 if(!NETWORKS[coin.toLowerCase()]) throw Error("103: unknown coin, no network found! coin: "+coin)
//                 const { address } = bitcoin.payments.p2pkh({
//                     pubkey: Buffer.from(pubkey,'hex'),
//                     network: NETWORKS[coin.toLowerCase()]
//                 })
//
//                 output = address
//                 break;
//         }
//
//
//         return output
//     },
//     generateMultiSigAddress: async function (pubkeys:any,m:number) {
//         const { address } = bitcoin.payments.p2wsh({
//             redeem: bitcoin.payments.p2ms({ m, pubkeys }),
//         });
//         return address
//     },
//     generateAddressPrivkey: async function (mnemonic:string,path:string) {
//         const seed = await bip39.mnemonicToSeed(mnemonic)
//         let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
//
//         //parse path
//         // "m/44'/714'/0'/0/093"
//         mk = mk.derive(path)
//         let privateKey = mk.privateKey
//         let publicKey = mk.publicKey
//
//         //let address = createBNBAddress(mk.publicKey)
//
//         return {privateKey,publicKey}
//     },
//     generateWalletFromSeed: async function (mnemonic:string) {
//         let output:Wallet = {
//             coins:{}
//         }
//         //for each coin
//         for(let i = 0; i < COIN_SUPPORT.length; i++){
//             let coin = COIN_SUPPORT[i]
//
//             let path = "m/44'/"+SLIP_44[coin]+"'/0'"
//
//             const {masterKey,xpub} = await deriveMasterKey(mnemonic,path)
//             //
//             const { privateKey, publicKey } = deriveKeypair(masterKey,path)
//             //const bnbAddress = createBNBAddress(publicKey)
//
//             // let master = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0)
//             let addressMaster:string = ""
//             if(coin === "BTC"){
//                 const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network:NETWORKS[coin.toLowerCase()] });
//                 addressMaster = address
//             } else {
//                 const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey, network:NETWORKS[coin.toLowerCase()] });
//                 addressMaster = address
//             }
//
//
//
//             console.log(addressMaster)
//             let coinInfo: CoinInfo = {
//                 coin,
//                 master:addressMaster,
//                 publicKey:publicKey.toString(`hex`),
//                 xpub
//             }
//
//             if(coin === "BTC"){
//                 let root = new BIP84.fromSeed(mnemonic)
//                 let child0 = root.deriveAccount(0)
//                 let account0 = new BIP84.fromZPrv(child0)
//                 let zpub = account0.getAccountPublicKey()
//                 coinInfo.zpub = zpub
//             }
//
//             console.log({coinInfo})
//
//             output.coins[coin] = coinInfo
//
//         }
//         return output
//     },
//     generateSeed: function () {
//         let randomBytesFunc = standardRandomBytesFunc
//         const randomBytes = Buffer.from(randomBytesFunc(32), `hex`)
//         if (randomBytes.length !== 32) throw Error(`Entropy has incorrect length`)
//         const mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`))
//         return mnemonic
//     },
// }

//get Xpub

function bech32ify(address:any, prefix:any) {
  const words = bech32.toWords(address);
  return bech32.encode(prefix, words);
}

//Build Seed
function standardRandomBytesFunc(size: any) {
  /* istanbul ignore if: not testable on node */

  return CryptoJS.lib.WordArray.random(size).toString();
}

async function deriveMasterKey(mnemonic: string, path: string) {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  const seed = await bip39.mnemonicToSeed(mnemonic);
  // let masterKey =  new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo(network).versions.bip32.versions)
  // //console.log("masterKey: ",masterKey)
  let mk = new HDKey.fromMasterSeed(Buffer.from(seed, "hex"));
  //console.log(mk.publicExtendedKey)

  //get key
  mk = mk.derive(path);
  //console.log(mk.publicExtendedKey)

  //get correct address with xpub
  let xpub = mk.publicExtendedKey;
  //console.log("xpub: ",xpub)

  let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey;
  //console.log("publicKey: ",publicKey)

  const masterKey = bip32.fromSeed(seed);
  return { masterKey, xpub };
}

function deriveKeypair(masterKey: any, path: string) {
  const master = masterKey.derivePath(path);
  const privateKey = master.privateKey;
  const publicKey = secp256k1.publicKeyCreate(privateKey, true);

  return {
    privateKey,
    publicKey,
  };
}
