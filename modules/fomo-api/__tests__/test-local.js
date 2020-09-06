
let fomo = require("../lib")

let wallet = require("@fomobro/fomo-wallet")
let shortid = require('shortid');

//let urlSpec = "http://127.0.0.1:8000/spec/swagger.json"
let urlSpec = "https://fomobro.com/spec/swagger.json"
console.log(urlSpec)


let run_test = async function(){
    try{

        //create new api keypair
        let newSeed = await wallet.onGetNewSeed();
        let apiKeys = await wallet.onBuildWallet(newSeed.seed);
        console.log("apiKeys: ",apiKeys)

        await fomo.init(urlSpec,{apiKey:apiKeys.account})

        let url = await fomo.url()
        console.log("url: ",url)

        //health
        let health = await fomo.health()
        console.log("health: ",health)

        //username
        let username = shortid.generate();
        username = "TEST:Anonymous:"+username;

        //create account
        let signup = await fomo.create(username,apiKeys.account)
        console.log("signup: ",signup)

        //get user info
        let userInfoPublic = await fomo.getUser(username)
        console.log("userInfoPublic: ",userInfoPublic)

        //get user info Private
        let userInfoPrivate = await fomo.getInfo(username)
        console.log("userInfoPrivate: ",userInfoPrivate)

        //create prediction
        // let inTenMinutes = new Date().getTime() + 1000 * 60 * 10
        // let inTenMinutes = new Date().getTime() + 1000 * 11
        // let prediction = {
        //     coin:"BTC",
        //     time:inTenMinutes.toString(),
        //     price:"10000"
        // }
        //
        // let predictionResult = await fomo.predict(prediction)
        // console.log("predictionResult: ",predictionResult)

    }catch(e){
        console.error(e)
    }
}

run_test()
