/**
 * Created by highlander on 5/27/17.
 */

//
const SlackBot = require('slackbots');
const randomHexColor = require('random-hex-color')

//
// const describe = require("./describe.js")

//config
//const config = require('../config')

//bot
//const botName = "balanceBot"
// const botName = config.slack.name
// const bot = new SlackBot(config.slack);
// const defaultChannelName = config.slack.fomoChannel


// const Redis = require('then-redis')
// const redBack = require("./redis.js")
//
// const usersByIndex = {}
// const usersByName = {}


// const defaultChannel = config.slack.fomoChannelId //NERF
// const fomoChannel = config.slack.fomoChannelId
// const defaultChannelName = config.slack.fomoChannel
// const fomoChannelName = config.slack.fomoChannel
// const paEnabled = config.slack.pa
// const fomo = config.slack.fomo


// bot.on('start', async function() {
//     // more information about additional params https://api.slack.com/methods/chat.postMessage
//     try{
//         let userList = await bot.getUsers()
//
//         for (let i = 0; i < userList.members.length; i++) {
//             usersByIndex[userList.members[i].id] = userList.members[i].name
//             usersByName[userList.members[i].name] = userList.members[i].id
//             //yield redis.hset(memberArray.members[i].id, "username", memberArray.members[i].name)
//         }
//         //console.log("usersArray: ",usersByIndex)
//         //console.log("usersByName: ",usersByName)
//
//     }catch(e){
//         console.error("ERROR: ",e)
//     }
// })

const TAG = " | Views | "
module.exports = {

    // help: function (integrations)
    // {
    //     return display_help(integrations);
    // },
    // helpFOMO: function (integrations)
    // {
    //     return display_help_fomo(integrations);
    // },
    // json: function (json)
    // {
    //     return json_2_attachment(json);
    // },
    //
    //
    // display: function (json)
    // {
    //     return display_json(json);
    // },
    //
    // history: function (json)
    // {
    //     return display_json_history(json);
    // },
    //
    // displayString: function (string)
    // {
    //     return display_string(string);
    // },
    //
    // displayStringToChannel: function (string,channel)
    // {
    //     return display_string_channel(string,channel);
    // },
    //
    // displayJsonToChannel: function (json,title,channel)
    // {
    //     return display_json_channel(json,title,channel);
    // },
    //
    //
    // displayStringToGroupParams: function (string,channel,params)
    // {
    //     return display_string_group_param(string,channel,params);
    // },
    //
    // displayStringToGroup: function (string,channel)
    // {
    //     return display_string_group(string,channel);
    // },
    // displayArrayToChannel: function (string,channel)
    // {
    //     return display_array_channel(string,channel);
    // },
    //
    // irregularities: function (json)
    // {
    //     return display_irregularities(json);
    // },
    // byCoin: function (input)
    // {
    //     return create_view_by_coin(input);
    // },
    // displayByCoin: function (input,title,channel)
    // {
    //     return display_view_by_coin(input,title,channel);
    // },
    // byAccount: function (input)
    // {
    //     return create_view_by_account(input);
    // },
    smart: function (input)
    {
        return display_smart(input);
    },
    // smartParams: function (input)
    // {
    //     return smart_view_builder(input);
    // },
    // smartDisplay: function (input,string)
    // {
    //     return display_json(input,string);
    // },
    // rawActionDisplay: function (input,string)
    // {
    //     return display_raw_actions(input,string);
    // },
    // rawActionInfoDisplay: function (input,string)
    // {
    //     return display_raw_actions_verbose(input,string);
    // },
    // actions: function (input)
    // {
    //     return display_actions(input);
    // },
};


/***************************
// Primary
//****************************/


const display_help = function(integrations){
    let tag = TAG+" | display help | "
    try{
        const debug = false

        if(debug) console.log(tag,"checkpoint1")
        if(debug) console.log(tag,"integrations: ",integrations)
        //get all integrations
        let attachments = []
        Object.keys(integrations).forEach(function(integration) {
            const map = describe.map(integrations[integration])
            if(debug) console.log(tag,"map: ",map)
            let output = ""
            Object.keys(map).forEach(function(key) {
                output = output+" Command: "+key+"\n     params: "+map[key].toString()+" \n"
            })
            const attachment = {
                "title": "Module: "+integration,
                "pretext": "",
                "color": randomHexColor(),
                "text": output,
                "mrkdwn_in": [
                    "text",
                    "pretext"
                ]
            }
            attachments.push(attachment)
        })

        let text = "to view live autobalance coins : *coins* \n"
        text = text + "add a new coin to be balanced : *addCoin* \n"
        text = text + "add a remove a coin from balancing : *addCoin* \n"
        text = text + "To start autobalancer (10min intervial): *run* \n"
        text = text + "To perform a single autoBlance: *runOnce* \n"
        text = text + "To view current autonomous status: *autonomous* \n"
        text = text + "To start an autonomous session: *autonomous time(seconds) (yubikey press)* \n"
        text = text + "To stop an autonomous session: *autonomousOff* \n"
        text = text + "To set a percentage rule for a coin : *setPercentage (coin) (hot/poloniex/bittrex/bitfinex/btce) (percent)* \n"
        text = text + "To see the lowest threshold of a send : *getMinIntervial (coin)* \n"
        text = text + "To set the lowest threshold of a send : *setMinIntervial (coin) (amount)* \n"
        text = text + "To view all balances : *balancesByCoin* \n"
        text = text + "To view all users being alerted : *alertUsers* \n"
        text = text + "To add an users to be alerted : *alertAdd (slack username)* \n"
        text = text + "To alertRemove an user to be alerted : *alertRemove (username)* \n"
        text = text + "To view recent actions ready to take : *actions* \n"
        text = text + "To view all irregularities in coin balances : *irregularities* \n"


        const attachment = {
            "title": "Sample Commands",
            "pretext": "Example commands",
            "text": text,
            "mrkdwn_in": [
                "text",
                "pretext"
            ]
        }
        attachments.push(attachment)

        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };

        return params
    }catch(e){
        //
        throw e
    }
}



/***************************
 // LIB
 //****************************/
const smart_view_builder = function(input){
    const tag = " | smart_view_builder | "
    const debug = false

    let attachments = []
    let output = {}
    let text = null


    if(typeof(input)=="string"){
        if(debug) console.log(tag," String detected!")
        try{
            //is JSON encoded string?
            input = JSON.parse(input)
        } catch(e){
            const attachment = {
                "title": "value: ",
                "text": input,
                "color": "#36a64f",
                "mrkdwn_in": [
                    "text",
                    "pretext"
                ]
            }
        }
    }

    if(Array.isArray(input)){
        if(debug) console.log(tag," array detected!")

        if(input.length === 1 && typeof(input[0]==="string")) {
            text = input[0]
        } else {

            //for each
            for (let i = 0; i < actions.input; i++) {




            }
        }
    } else if(typeof(input)=="object"){
        if(debug) console.log(tag," JSON assumed!")

        //types of views
        //smart for each key

        //if key = string

        //if key = array

        //if key = object

        //
        //single json
        attachments.push(json_2_attachment(input))
    }

    const params = {
        icon_emoji: ':coincap_v2:',
        "attachments": attachments
    };
    output.params = params
    output.text = text
    return output
}

const display_smart = async function(input) {
    const tag = TAG+" | display_smart | "
    const debug = true
    try {
        if(debug) console.log(tag,"input: ",input)
        let attachments = []
        let msg
        if(input.sentences){
            if(debug) console.log(tag,"sentences detected ")
            //for each
            for (let i = 0; i < input.sentences.length; i++) {

                let sentence =  input.sentences[i]
                try{
                    if(typeof(sentence) === 'string') sentence = JSON.parse(sentence)

                    if(sentence.response){
                        msg = sentence.response
                        let attachmentsSmart = create_view_smart(sentence.response)
                        if(debug) console.log(tag,"attachmentsSmart: ",attachmentsSmart)
                        for (let j = 0; j < attachmentsSmart.length; j++) {
                            attachments.push(attachmentsSmart[i])
                        }
                    } else {
                        msg = sentence
                        let attachmentsSmart = create_view_smart(sentence)
                        if(debug) console.log(tag,"attachment: ",attachment)
                        for (let j = 0; j < attachmentsSmart.length; j++) {
                            attachments.push(attachmentsSmart[i])
                        }
                    }
                }catch(e){
                    msg = sentence
                    console.error(tag,"no JSON: ")
                    let attachment = create_view_smart(sentence)
                    if(debug) console.log(tag,"attachment: ",attachment)
                    attachments.push(attachment)
                }


            }
        } else {
            msg = input
            if(debug) console.log(tag,"legacy format detected ")
            let attachment = create_view_smart(input)
            attachments.push(attachment)
        }



        let output = {}
        //attachments.push(attachment)
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"params: ",params)
        output.view = params
        output.msg = msg
        return output
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}




const display_raw_actions_verbose = function(actions,title){
    const tag = TAG+" | display_raw_actions | "
    const debug = false
    try {
        let text = ""
        if(debug) console.log(tag,"actions: ",actions)
        const attachments = []
        //iterate over json

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i]
            let actionId = Object.keys(action)[0]
            let actionInfo = action[actionId]
            if(actions[i].description) {
                text = text + "\n  "+actionId+":   :"+actionInfo.coin+":  *"+actionInfo.amount.toLocaleString()+"* (Weight: "+parseInt(actions[i].amount)+") :"+actionInfo.from+":  :arrow_forward:   :"+actionInfo.to+":  "+actions[i].description
            } else {
                text = text + "\n  "+actionId+":   :"+actionInfo.coin+":  *"+actionInfo.amount.toLocaleString()+"* (Weight: "+parseInt(actions[i].amount)+") :"+actionInfo.from+":  :arrow_forward:   :"+actionInfo.to+":  "
            }

        }
        if(debug) console.log(tag,"text: ",text)

        const attachment = {
            "title": title,
            //"pretext": "Belongs to account: "+orderResponse.response.account,
            "text": text,
            "color": "#36a64f",
            "mrkdwn_in": [
                "text",
                "pretext"
            ]
        }
        attachments.push(attachment)
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(defaultChannelName,title, params);

    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}

const display_raw_actions = function(actions,title){
    const tag = TAG+" | display_raw_actions | "
    const debug = false
    try {
        let text = ""
        if(debug) console.log(tag,"actions: ",actions)
        const attachments = []
        //iterate over json

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i]
            let actionId = Object.keys(action)[0]
            let actionInfo = action[actionId]
            text = text + "\n  "+actionId+":   :"+actionInfo.coin+":  *"+actionInfo.amount.toLocaleString()+"*  :"+actionInfo.from+":  :arrow_forward:   :"+actionInfo.to+":"

        }

        // for (const actionId in actions) {
        //     if (actions.hasOwnProperty(actionId)) {
        //         let action = actions[actionId]
        //         if(debug) console.log(tag,"1*action: ",action)
        //         if(typeof(action) == "string") action = JSON.parse(action)
        //         if(debug) console.log(tag,"2*action: ",Object.keys(action))
        //         if(debug) console.log(tag,"3*action: ",action[actionId])
        //         //action = action[]
        //         if(debug) console.log(tag,"4*action: ",actionId)
        //         if(debug) console.log(tag,"4*action: ",action)
        //         if(debug) console.log(tag,"5*action: ",action.coin)
        //         //const action = json[property].split(" ")
        //         //if(action[0] === "dash") action[0] = "dash_"
        //         text = text + "\n "+actionId+":  :"+action.coin+": *"+action.amount.toLocaleString()+"* :"+action.from+": :arrow_forward:  :"+action.to+":"
        //     }
        // }
        if(debug) console.log(tag,"text: ",text)

        const attachment = {
            "title": title,
            //"pretext": "Belongs to account: "+orderResponse.response.account,
            "text": text,
            "color": "#36a64f",
            "mrkdwn_in": [
                "text",
                "pretext"
            ]
        }
        attachments.push(attachment)
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(defaultChannelName,title, params);

    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}


// const display_raw_actions = function(actions,title){
//     const tag = TAG+" | json_2_action_view | "
//     let text = ""
//     const debug = false
//     if(debug) console.log(tag,"actions: ",actions)
//     const attachments = []
//     //iterate over json
//
//     for (const actionId in actions) {
//         if (actions.hasOwnProperty(actionId)) {
//             let action = actions[actionId]
//             //const action = json[property].split(" ")
//             //if(action[0] === "dash") action[0] = "dash_"
//             if(!action.chosen){
//                 text = text + "\n "+actionId+":  :"+action.coin+": *"+action.amount.toLocaleString()+"* :"+action.source+": :arrow_forward:  :"+action.destination+": not chosen: "+action.description
//             } else {
//                 text = text + "\n "+actionId+":  :"+action.coin+": *"+action.amount.toLocaleString()+"* :"+action.source+": :arrow_forward:  :"+action.destination+": (BEST OPEN PATH) "
//             }
//         }
//     }
//     if(debug) console.log(tag,"text: ",text)
//     const attachment = {
//         "title": title,
//         //"pretext": "Belongs to account: "+orderResponse.response.account,
//         "text": text,
//         "color": "#36a64f",
//         "mrkdwn_in": [
//             "text",
//             "pretext"
//         ]
//     }
//     return attachment
// }

const display_array_channel = async function(array,channel,title) {
    const tag = TAG+" | display_string | "
    const debug = false
    try {
        let attachments = []

        for (let i = 0; i < array.length; i++) {
            attachments.push(json_2_attachment(array[i]))
        }

        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(channel," info: "+title, params);
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}


const display_string_group_param = async function(string,channel,params) {
    const tag = TAG+" | display_string | "
    const debug = false
    try {
        let attachments = []
        // const params = {
        //     icon_emoji: ':coincap_v2:',
        //     "attachments": attachments
        // };
        //console.log(bot)

        channel = channel.trim()
        if(debug) console.log(tag,"attachments: ",attachments)
        if(debug) console.log(tag,"channel: ",channel)
        if(debug) console.log(tag,"string: ",string)
        //let result = await bot.postMessageToChannel(channel,string, params)
        bot.postMessageToGroup(channel,string, params, function(err,resp){
            console.log(tag,"error: ",err)
            console.log(tag,"resp: ",resp)
        })
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}



const display_string_group = async function(string,channel) {
    const tag = TAG+" | display_string | "
    const debug = false
    try {
        let attachments = []
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        //console.log(bot)

        channel = channel.trim()
        if(debug) console.log(tag,"attachments: ",attachments)
        if(debug) console.log(tag,"channel: ",channel)
        if(debug) console.log(tag,"string: ",string)
        //let result = await bot.postMessageToChannel(channel,string, params)
        bot.postMessageToGroup(channel,string, params, function(err,resp){
            console.log(tag,"error: ",err)
            console.log(tag,"resp: ",resp)
        })
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}

const display_string_channel = async function(string,channel) {
    const tag = TAG+" | display_string | "
    const debug = false
    try {
        let attachments = []
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        //console.log(bot)

        channel = channel.trim()
        if(debug) console.log(tag,"attachments: ",attachments)
        if(debug) console.log(tag,"channel: ",channel)
        if(debug) console.log(tag,"string: ",string)
        //let result = await bot.postMessageToChannel(channel,string, params)
        bot.postMessageToChannel(channel,string, params, function(err,resp){
            if(debug) console.log(tag,"error: ",err)
            if(debug) console.log(tag,"resp: ",resp)
        })
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}

const display_string = async function(string) {
    const tag = TAG+" | display_string | "
    const debug = false
    try {
        let attachments = []
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(defaultChannelName,string, params);
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}


const display_json_channel = async function(json,title,channel) {
    const tag = TAG+" | display_json | "
    const debug = false
    try {
        let attachment = json_2_attachment(json,title)
        let attachments = []
        attachments.push(attachment)
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(channel,"title: "+title, params);
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}

const display_json_history = function(json,title) {
    const tag = TAG+" | display_json | "
    const debug = false
    try {
        if(!json.result) return "unkown format"
        if(!json.result.deposits) return "unkown format"
        if(!json.result.withdrawals) return "unkown format"

        //epxect array of jsons for each
        let attachments = []
        attachments = array_to_attachments(json.result.deposits,attachments)
        attachments = array_to_attachments(json.result.withdrawals,attachments)

        //let attachments = attachmentsDeposits.concat(attachmentsWithdrawals)

        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        //bot.postMessageToChannel(defaultChannelName,"title: "+title, params);
        return params
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}


const display_json = async function(json,title) {
    const tag = TAG+" | display_json | "
    const debug = false
    try {
        let attachment = json_2_attachment(json,title)
        let attachments = []
        attachments.push(attachment)
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(defaultChannelName,"title: "+title, params);
        return true
    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}



//
const display_irregularities = async function(analysis) {
    const tag = TAG+" | display_irregularities | "
    const debug = false
    try {
        attachments = []
        for (let i = 0; i < analysis.length; i++) {
            const attachment = json_2_mview(analysis[i],"irregularities needing correction: ")
            attachments.push(attachment)
        }
        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)
        bot.postMessageToChannel(defaultChannelName,"irregularities: ", params);

    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}
//
const display_actions = async function(actions) {
    const tag = TAG+" | display_actions | "
    const debug = false
    try {
        console.log(tag," actions: ",actions)
        const attachments = []

        //iterate over
        let actionIds = Object.keys(actions)
        for (let i = 0; i < actionIds.length; i++) {
            let actionId = actionIds[i]
            let summary = await redBack.get(actionId)
            summary = JSON.parse(summary)
            if(debug) console.log(tag,"**** summary: ",summary)
            //justify all actions

            //balances before
            // if(summary.coin === "dash") summary.coin = "dash_"
            attachments.push(json_2_balance_mview(summary, summary.coinBalance,summary.coinRules,":"+summary.coin+": Balances before action: "+actionId))

            //balances after
            attachments.push(json_2_balance_mview(summary, summary.balancesAfter,summary.coinRules,":"+summary.coin+": Balances after action: "+actionId))
        }


        const attachment = json_2_action_view(actions,"Actions added to Queue: (coin, amount, source, destination)")
        if(debug) console.log(tag,"attachment: ",attachment)
        attachments.push(attachment)

        const params = {
            icon_emoji: ':coincap_v2:',
            "attachments": attachments
        };
        if(debug) console.log(tag,"attachments: ",attachments)

        let alerts = ""
        const alertUsers = await redBack.smembers("alertUsers")
        for (let i = 0; i < alertUsers.length; i++) {
            alerts = alerts+"<@"+usersByName[alertUsers[i]]+">"
        }

        bot.postMessageToChannel(defaultChannelName," Actions Ready to take", params);

    }catch(e){
        console.error(tag,"ERROR:",e)
    }
}
//

const json_2_balance_mview = function(summary,json,rules,title){
    const tag = TAG+" | json_2_balance_mview | "
    let text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    if(debug) console.log(tag,"summary: ",summary)
    const attachments = []
    //iterate over json
    for (const property in json) {
        if (json.hasOwnProperty(property)) {
            if(rules[property]){
                if(json[property] != 0){
                    if(rules[property].min > json[property]){
                        if(!rules[property].max) rules[property].max = 0
                        if(!rules[property].min) rules[property].min = 0
                        text = text + "\n :"+property+": *"+json[property] + "*   m:"+ parseInt(rules[property].min) +"   M:"+parseInt(rules[property].max) //+"                         % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
                    } else if(rules[property].max < json[property]){
                        if(!rules[property].max) rules[property].max = 0
                        text = text + "\n :"+property+":  m:"+ parseInt(rules[property].min) +"   M:"+parseInt(rules[property].max)+"   *"+json[property] + "*" //+ "                     % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
                    } else {
                        text = text + "\n :"+property+":  m:"+ parseInt(rules[property].min) +"   *"+json[property] + "*   M:"+parseInt(rules[property].max)+"" //+"                     % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
                    }
                }
            }
        }
    }
    if(debug) console.log(tag,"text: ",text)
    const attachment = {
        "title": title,
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": text,
        "color": "#36a64f",
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}


// const json_2_balance_mview = function(summary,json,rules,title){
//     const tag = TAG+" | json_2_balance_mview | "
//     let text = ""
//     const debug = false
//     if(debug) console.log(tag,"json: ",json)
//     if(debug) console.log(tag,"summary: ",summary)
//     const attachments = []
//     //iterate over json
//     for (const property in json) {
//         if (json.hasOwnProperty(property)) {
//             if(rules[property]){
//                 if(json[property] != 0){
//                     if(rules[property].min > json[property]){
//                         if(!rules[property].max) rules[property].max = 0
//                         if(!rules[property].min) rules[property].min = 0
//                         text = text + "\n :"+property+": *"+json[property].toLocaleString() + "*   m:"+ parseInt(rules[property].min).toLocaleString() +"   M:"+parseInt(rules[property].max).toLocaleString() //+"                         % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
//                     } else if(rules[property].max < json[property]){
//                         if(!rules[property].max) rules[property].max = 0
//                         text = text + "\n :"+property+":  m:"+ parseInt(rules[property].min).toLocaleString() +"   M:"+parseInt(rules[property].max).toLocaleString()+"   *"+json[property].toLocaleString() + "*" //+ "                     % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
//                     } else {
//                         text = text + "\n :"+property+":  m:"+ parseInt(rules[property].min).toLocaleString() +"   *"+json[property].toLocaleString() + "*   M:"+parseInt(rules[property].max).toLocaleString()+"" //+"                     % (a:"+summary.percentagesActual[property]+" t:"+ summary.percentagesTarget[property] +")"
//                     }
//                 }
//             }
//         }
//     }
//     if(debug) console.log(tag,"text: ",text)
//     const attachment = {
//         "title": title,
//         //"pretext": "Belongs to account: "+orderResponse.response.account,
//         "text": text,
//         "color": "#36a64f",
//         "mrkdwn_in": [
//             "text",
//             "pretext"
//         ]
//     }
//     return attachment
// }
//
// const json_2_balance_attachment = function(json,rules,title){
//     const tag = TAG+" | json_2_balance_attachment | "
//     const text = ""
//     const debug = false
//     if(debug) console.log(tag,"json: ",json)
//     const attachments = []
//     //iterate over json
//     for (const property in json) {
//         if (json.hasOwnProperty(property)) {
//             if(!rules[property]) rules[property] = {}
//             if(!rules[property]) rules[property].max = 0
//             if(!rules[property]) rules[property].min = 0
//             text = text + "\n "+property+":  "+json[property].toLocaleString() +" (max:"+ parseInt(rules[property].max).toLocaleString().toLocaleString() + " min: "+parseInt(rules[property].min).toLocaleString()+")"
//         }
//     }
//     if(debug) console.log(tag,"text: ",text)
//     const attachment = {
//         "title": title,
//         //"pretext": "Belongs to account: "+orderResponse.response.account,
//         "text": text,
//         "color": "#36a64f",
//         "mrkdwn_in": [
//             "text",
//             "pretext"
//         ]
//     }
//     return attachment
// }
//
const json_2_mview = function(json,title){
    const tag = TAG+" | json_2_mview | "
    const text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    const attachments = []
    //iterate over json

    if(debug) console.log(tag,"text: ",text)
    let event
    let target
    let color
    if(json.event === "over") event = ">"
    if(json.event === "under") event = "<"
    if(json.event === "over") target = json.max
    if(json.event === "under") target = json.min
    if(json.event === "over") color = "#ff0000"
    if(json.event === "under") color = "#36a64f"
    //if(json.coin === "dash") json.coin = "dash_"
    const attachment = {
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": ":"+json.source+": :"+json.coin+": "+" "+parseInt(json.actual).toLocaleString()+" "+event+" "+target.toLocaleString(),
        "color": color,
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}

//
const json_2_action_view = function(json,title){
    const tag = TAG+" | json_2_action_view | "
    let text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    const attachments = []
    //iterate over json

    for (const property in json) {
        if (json.hasOwnProperty(property)) {
            const action = json[property].split(" ")
            //if(action[0] === "dash") action[0] = "dash_"
            text = text + "\n "+property+":  :"+action[0]+": *"+action[1].toLocaleString()+"* :"+action[2]+": :arrow_forward:  :"+action[3]+":"
        }
    }
    if(debug) console.log(tag,"text: ",text)
    const attachment = {
        "title": title,
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": text,
        "color": "#36a64f",
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}

//
const json_2_attachment = function(json,title){
    const tag = TAG+" | json_2_attachment | "
    let text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    const attachments = []
    //iterate over json
    for (const property in json) {
        if (json.hasOwnProperty(property)) {
            if(json[property] && typeof(json[property]) == "string"){
                text = text + "\n "+property+":  "+json[property]
                //text = text + "\n "+property+":  "+JSON.stringify(json[property])
            } else {
                text = text + "\n "+property+":  "+JSON.stringify(json[property])
            }

        }
    }
    if(debug) console.log(tag,"text: ",text)
    const attachment = {
        "title": title,
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": text,
        "color": "#36a64f",
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}



// function getAddressLink(coin, addy)
// {
//     if (!coin)
//         return "#'>"
//
//     let lookupUrl = "http://bitinfocharts.com/" + getCoinNameBy(coin).toLowerCase() + "/address/" + addy
//     if (_.contains(["BTC", "LTC", "QRK"], coin.toUpperCase()))
//     {
//         lookupUrl = "http://" + coin.toLowerCase() + ".blockr.io/address/info/" + addy
//     }
//     else if (coin.toUpperCase() === "NXT")
//     {
//         lookupUrl = "http://nxtportal.org/search/" + addy ;
//     }
//     else if (coin.toUpperCase() === "XRP")
//     {
//         lookupUrl = "https://explor.io/#/ripple/accounts/" + addy ;
//     }
//
//     else if (_.contains(["ETH","DGD"], coin.toUpperCase()))
//     {
//         lookupUrl = "https://etherscan.io/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "ETC")
//     {
//         lookupUrl = "http://gastracker.io/addr/" + addy ;
//     }
//     else if (_.contains(["XCP","GEMZ", "SWARM", "SJCX", "BCY"], coin.toUpperCase()))
//     {
//         lookupUrl = "https://blockscan.com/address?q=" + addy ;
//     }
//     else if (_.contains(["BTS","BITUSD"], coin.toUpperCase()))
//     {
//         lookupUrl = "https://cryptofresh.com/u/" + addy ;
//     }
//
//     else if (_.contains(["USDT", "MSC", "OMNI", "MAID"], coin.toUpperCase()))
//     {
//         lookupUrl = "http://omnichest.info/lookupadd.aspx?address=" + addy ;
//     }
//     else if (coin.toUpperCase() === "XMR")
//     {
//         lookupUrl = "http://moneroblocks.info/search/" + addy ;
//     }
//     else if (coin.toUpperCase() === "NBT")
//     {
//         lookupUrl = "http://explorer.coinpayments.net/address.php?chain=1&addr=" + addy ;
//     }
//     else if (coin.toUpperCase() === "CLAM")
//     {
//         lookupUrl = "http://clamsight.com/address/" + addy ;
//     }
//
//     else if (coin.toUpperCase() === "STR")
//     {
//         lookupUrl = "http://stellarchain.io/address/" + addy ;
//     }
//     else if (_.contains(["BLK","DASH","PPC", "VRC"], coin.toUpperCase()))
//     {
//         lookupUrl = "https://chainz.cryptoid.info/" + coin.toLowerCase() + "/address.dws?" + addy ;
//     }
//     else if (coin.toUpperCase() === "DOGE")
//     {
//         lookupUrl = "http://dogechain.info/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "EMC")
//     {
//         lookupUrl = "http://emercoin.mintr.org/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "FCT")
//     {
//         lookupUrl = "http://explorer.factom.org/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "LBC")
//     {
//         lookupUrl = "http://explorer.lbry.io/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "NMC")
//     {
//         lookupUrl = "https://bchain.info/NMC/addr/" + addy ;
//     }
//     else if (coin.toUpperCase() === "RDD")
//     {
//         lookupUrl = "http://live.reddcoin.com/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "SDC")
//     {
//         lookupUrl = "http://explorer.shadow.cash/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "START")
//     {
//         lookupUrl = "http://explorer.startcoin.org/address/" + addy ;
//     }
//     else if (coin.toUpperCase() === "STEEM")
//     {
//         lookupUrl = "https://steemd.com/@" + addy ;
//     }
//     else if (coin.toUpperCase() === "VOX")
//     {
//         lookupUrl = "https://www.blockexperts.com/vox/address/" + addy ;
//     }
//
//
//
//     return lookupUrl;
// }


/***********************************************
 //        views
 //***********************************************/


//Smart objects to links!
// const json_2_attachment = function(json){
//     let tag = TAG+" | display help | "
//     let text = ""
//     let debug = false
//     if(debug) console.log(tag,"json: ",json)
//
//     //iterate over json
//     for (const property in json) {
//         if (json.hasOwnProperty(property)) {
//
//             if(property === "txid") {
//                 //if property is txid link
//                 text = text+"\n "+property+":  "+getTxLink(json.currencyIn,json[property])
//             } else if(property === "address"){
//                 //if propery is address link
//                 text = text+"\n "+property+":  "+getAddressLink(json.currencyIn,json[property])
//             } else if(property === "withdraw"){
//                 //if propery is address link
//                 text = text+"\n "+property+":  "+getAddressLink(json.currencyOut,json[property])
//             } else if(property === "txidOfCoinToUser"){
//                 //if propery is address link
//                 text = text+"\n "+property+":  "+getTxLink(json.currencyOut,json[property])
//             }else if(property === "orderId"){
//                 //if proterty is orderid link
//                 text = text+"\n "+property+":  "+"https://rocket.io/#/status/"+json[property]
//             }elseif(){
//                 text = text + "\n "+property+":  "+json[property]
//             }
//         }
//     }
//     if(debug) console.log(tag,"text: ",text)
//     let attachments = []
//     const attachment = {
//         "title": "Order: ",
//         //"pretext": "Belongs to account: "+orderResponse.response.account,
//         "text": text,
//         "color": "#36a64f",
//         "mrkdwn_in": [
//             "text",
//             "pretext"
//         ]
//     }
//     attachments.push(attachment)
//
//
//
//     //rocket
//     if(json && json.deposit){
//         const attachment = {
//             "fallback": " - https://blockchain.info/address/"+json.deposit,
//             "title":"Blockchain.info",
//             "title_link": "https://blockchain.info/address/"+json.deposit,
//             "text": "Send "+json.depositType+" here! "+json.deposit,
//             "image_url": "https://blockchain.info/qr?data="+json.deposit,
//             "color": "#764FA5"
//         }
//         attachments.push(attachment)
//     }
//
//
//     const params = {
//         icon_emoji: ':information_source:',
//         "attachments": attachments
//     };
//
//     return params
// }

const create_view_by_account = function(input){
    const tag = " | create_view_by_account | "
    let attachments = []
    const debug = false

    if(typeof(input)=="string"){
        if(debug) console.log(tag," String detected!")
        input = JSON.parse(input)
    }

    if(Array.isArray(input)){
        if(debug) console.log(tag," array detected!")
        //detect type
        attachments = array_to_attachments(input,attachments)
    } else {
        if(debug) console.log(tag," JSON of JSON's of JSON's assumed!")
        //single json
        Object.keys(input).forEach(function(account) {
            Object.keys(input[account]).forEach(function(coin) {
                attachments.push(json_2_attachment_titled(input[account][coin],":"+coin+": info: "))
            })
        })
    }

    const params = {
        icon_emoji: ':information_source:',
        "attachments": attachments
    };


    return params
}

//array 2 attachment
const array_to_attachments = function(input,attachments){
    const tag = " | array_to_attachment | "
    const debug = false


    //detect type
    if(typeof(input[0]) === "object"){
        if(debug) console.log(tag," Array of JSON assumed!")
        //array of json
        for (let i = 0; i < input.length; i++) {
            let attachment = json_2_attachment(input[i])
            attachments.push(attachment)
        }
    } else if(typeof(input[0]) === "string"){
        if(debug) console.log(tag," Array of strings assumed!")
        let text = ""
        for (let i = 0; i < input.length; i++) {
            text = text + " "+i+": "+input[i]+" \n"
        }

        const attachment = {
            "title": "",
            "text": text,
            "color": "#36a64f",
            "mrkdwn_in": [
                "text",
                "pretext"
            ]
        }
        attachments.push(attachment)
    }

    return attachments
}


//
const create_view_by_coin = function(input){
    const tag = " | create_view_by_coin | "
    let attachments = []
    const debug = false

    if(typeof(input)=="string"){
        if(debug) console.log(tag," String detected!")
        input = JSON.parse(input)
    }

    if(Array.isArray(input)){
        if(debug) console.log(tag," array detected!")
        //detect type
        attachments = array_to_attachments(input,attachments)
    } else {
        if(debug) console.log(tag," JSON of JSON's assumed!")
        //single json
        Object.keys(input).forEach(function(coin) {
            attachments.push(json_2_attachment_titled(input[coin],":"+coin+": info: "))
        })
    }

    const params = {
        icon_emoji: ':information_source:',
        "attachments": attachments
    };


    return params
}


const display_view_by_coin = function(input,title,channel){
    const tag = " | display_view_by_coin | "
    let attachments = []
    const debug = false

    if(typeof(input)=="string"){
        if(debug) console.log(tag," String detected!")
        input = JSON.parse(input)
    }

    if(Array.isArray(input)){
        if(debug) console.log(tag," array detected!")
        //detect type
        attachments = array_to_attachments(input,attachments)
    } else {
        if(debug) console.log(tag," JSON of JSON's assumed!")
        //single json
        Object.keys(input).forEach(function(coin) {
            attachments.push(json_2_attachment_titled(input[coin],":"+coin+": info: "))
        })
    }

    const params = {
        icon_emoji: ':information_source:',
        "attachments": attachments
    };

    //
    if(debug) console.log(tag,"attachments: ",attachments)
    bot.postMessageToChannel(channel,title, params);

    return params
}

//
const create_view_smart = function(input){
    const tag = " | create_view_smart | "
    let attachments = []
    const debug = false
    if(debug) console.log(tag," checkpoint1")

    if(typeof(input)=="string"){
        if(debug) console.log(tag," String detected!")
        try{
            //is JSON encoded string?
            input = JSON.parse(input)
        } catch(e){
            const attachment = {
                "title": "value: ",
                "text": input,
                "color": "#36a64f",
                "mrkdwn_in": [
                    "text",
                    "pretext"
                ]
            }
        }
    }

    if(Array.isArray(input)){
        if(debug) console.log(tag," array detected!")
        //detect type
        attachments = array_to_attachments(input,attachments)
    } else if(typeof(input)=="object"){
        if(debug) console.log(tag," JSON assumed!")

        //
        //single json
        attachments.push(json_2_attachment(input))
    }

    // const params = {
    //     icon_emoji: ':information_source:',
    //     "attachments": attachments
    // };


    return attachments
}

//
const json_2_balance_attachment = function(json,rules,title){
    const tag = TAG+" | json_2_balance_attachment | "
    let text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    const attachments = []
    //iterate over json
    for (const property in json) {
        if (json.hasOwnProperty(property)) {
            text = text + "\n "+property+":  m:"+ rules[property].min + " *"+json[property] +"* M: "+rules[property].max
        }
    }
    if(debug) console.log(tag,"text: ",text)
    const attachment = {
        "title": title,
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": text,
        "color": "#36a64f",
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}

const json_2_attachment_titled = function(json,title){
    const tag = TAG+" | json_2_attachment_titled | "
    let text = ""
    const debug = false
    if(debug) console.log(tag,"json: ",json)
    const attachments = []
    //iterate over json
    for (const property in json) {
        if (json.hasOwnProperty(property)) {
            text = text + "\n "+property+":  "+json[property]
        }
    }
    if(debug) console.log(tag,"text: ",text)
    const attachment = {
        "title": title,
        //"pretext": "Belongs to account: "+orderResponse.response.account,
        "text": text,
        "color": "#36a64f",
        "mrkdwn_in": [
            "text",
            "pretext"
        ]
    }
    return attachment
}
