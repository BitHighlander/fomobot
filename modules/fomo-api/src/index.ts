/**
 *  fomo Client
 *
 */


const TAG = " | fomo-client-ts | "
const log = require("loggerdog-client")()

//Citadel follows OpenAPI spec
const Citadel = require('openapi-client-axios').default;
let fomoApi:any

module.exports = {
    init:async function (spec:string,config:any) {
        if(!config.apiKey) throw Error(" You must create an api key! ")
        fomoApi = new Citadel({
            definition:spec,
            axiosConfigDefaults: {
                headers: {
                    'Authorization': config.apiKey,
                },
            }
        });
        await fomoApi.init()
        return
    },
    url:async function () {
        return fomoApi.getBaseURL();
    },
    health:async function () {
        let health = await fomoApi.instance.Health()
        return health.data;
    },
    getInfo:async function () {
        let resp = await fomoApi.instance.GetInfo()
        return resp.data;
    },
    getUser:async function (username:string) {
        let resp = await fomoApi.instance.User(username)
        return resp.data;
    },
    create:async function (username:string,account:string) {
        let resp = await fomoApi.instance.CreateAccount(null,{username,account})
        return resp.data;
    },
    predict:async function (prediction:any) {
        let resp = await fomoApi.instance.CreatePrediction(null,prediction)
        return resp.data;
    },
};
