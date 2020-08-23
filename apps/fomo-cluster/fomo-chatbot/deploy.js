
/*
    Deployment info

    ENV verification

    deployment description
 */


let packageInfo = require("./package.json")
const TAG = " |"+packageInfo.name+"|  "

let ASSET = "ATOM"
let ASSET_LONG = 'cosmos'
let ENV_VARS = [
    'NODE_ENV',
    'DATADOG_API',
    'SLACK_TOKEN',
    'SLACK_CHANNEL_CCV3',
    'SLACK_CHANNELID_CCV3',
    'REDIS_CONNECTION',
    'MONGO_CONNECTION',
]

let ENV_VAR_LONG = []
ENV_VAR_LONG.push({name:"ASSET",value:ASSET})
for(let i = 0; i < ENV_VARS.length;i++){
    ENV_VAR_LONG.push({name:ENV_VARS[i],value:process.env[ENV_VARS[i]]})
}

let ingress
if(process.env['NODE_ENV'] === 'production'){
    ingress = "citadel-"+ASSET_LONG+".citadel.prod.chiefhappinessofficerellie.org"
} else if(process.env['NODE_ENV'] === 'staging') {
    ingress = "citadel-"+ASSET_LONG+".citadel.stage.chiefhappinessofficerellie.org"
} else if(process.env['NODE_ENV'] === 'skunkworks'){
    ingress = "citadel-"+ASSET_LONG+".skunkworks.stage.chiefhappinessofficerellie.org"
} else {
    //throw Error("102: unknown env~! "+process.env['NODE_ENV'])
}

module.exports = {
    init: function () {
        return init_deploy();
    },
    envs:['skunkworks'],
    deploy:true,
    tier:2,
    replicas:1,
    limits: {
        cpu: '256m',
        memory: '256M'
    },
    requests: {
        cpu: '50m',
        memory: '128M'
    },
    liveness:{
        exec: {
            command: ['node', 'isLive.js']
        },
        initialDelaySeconds: 5,
        periodSeconds: 5, // probe once every X seconds
        failureThreshold: 1 // try period * failureThreshold # of times
    },
    readyness:{
        exec: {
            command: ['node', 'isReady.js']
        },
        initialDelaySeconds: 10,
        periodSeconds: 10, // probe once every X seconds
        failureThreshold: 1 // try period * failureThreshold # of times
    },
    context:__dirname,
    asset:ASSET,
    name:packageInfo.name,
    version:packageInfo.version,
    featureFlags:[],
    services:[],
    ingress:true,
    ingressURL:ingress,
    env:ENV_VAR_LONG
}

/*
    Main

 */

const init_deploy = async function () {
    let tag = TAG + " | init_deploy | "
    try {

        for(let i = 0; i < ENV_VARS.length;i++){
            if(!process.env[ENV_VARS[i]]) throw Error("missing ENV var: "+ENV_VARS[i])
        }

        return true
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}
