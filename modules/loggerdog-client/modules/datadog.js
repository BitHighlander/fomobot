/*
    Logger-dog
        A data-dog logger module
          powered by redis


              _=,_
           o_/6 /#\
           \__ |##/
            ='|--\
              /   #'-.
              \#|_   _'-. /
               |/ \_( # |"
               C/ ,--___/

                     -Highlander

    Notes:
       All services you wish to log from MUST have access to redis

        A single hub will need to be able to connect to datadog

        Log Levels are adjustable via process.env or OVERRODE by redis

       * Remember (Live Config) > ENV > defaults *

 */
let TAG = " index "
let os = require('os')
const rp = require("request-promise")


const DATADOG_API = process.env["DATADOG_API"]

module.exports = {
    debug:function(tag,message,object){
        return send_log_info(tag,message,object)
    },
    info:function(tag,message,object){
        return send_log_info(tag,message,object)
    },
    warn:function(tag,message,object){
        return send_log_warn(tag,message,object)
    },
    error:function(tag,message,object){
        return send_log_error(tag,message,object)
    }
}


let send_log_info = async function(tag,message,object){
    try{
        //log to console
        console.log(tag,message,object)

        if(object){
            message = message + " object: "+JSON.stringify(object)
        }

        let body = {
            level:"info",
            message,
            ddsource:"testbox",
            ddtags:"status:info,env:production,tag:"+tag,
            user:"bro",
            hostname:os.hostname()
        }
        let url = "https://http-intake.logs.datadoghq.com/v1/input/"+DATADOG_API
        let result = await sendPostRequest(url,body)

        return result
    }catch(e){
        console.error(e)
    }
}


let send_log_warn = async function(tag,message,object){
    try{
        let body = {
            level:"warn",
            message,
            ddsource:"testbox",
            ddtags:"status:warn,env:production",
            user:"bro",
            hostname:os.hostname()
        }
        let url = "https://http-intake.logs.datadoghq.com/v1/input/"+DATADOG_API
        let result = await sendPostRequest(url,body)

        return result
    }catch(e){
        console.error(e)
    }
}

let send_log_error = async function(tag,message,object){
    try{
        let body = {
            level:"error",
            message,
            ddsource:"testbox",
            ddtags:"status:error,env:production,level:error",
            user:"bro",
            hostname:os.hostname()
        }
        let url = "https://http-intake.logs.datadoghq.com/v1/input/"+DATADOG_API
        let result = await sendPostRequest(url,body)

        return result
    }catch(e){
        console.error(e)
    }
}







let sendPostRequest = async function (url,body) {
    let tag = TAG + " | send_post_request | "
    try {
        //url = "http://" + process.env.GRIN_USERNAME + ":" + process.env.GRIN_PASSWORD + "@" + url
        //console.log(tag,"url: ",url)


        let options = {
            method: 'POST',
            uri: url,
            body: body,
            json: true // Automatically stratifies the body to JSON
        };

        let result = await rp(options)
        //console.log(tag,result)
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

