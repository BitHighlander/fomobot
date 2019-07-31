


/*
        Reporting module
 */


let TAG = '| reports |'
const util = require('./redis')
const redis = util.redis
const config = require("../configs/env")
const SlackUpload = require('node-slack-upload')
const slackUp = new SlackUpload(config.SLACK_TOKEN)
//const json2csv = require('json2csv')
const json2csv = require('json2csv').Parser;
const when = require('when')
const fs = require('fs')

//mongo
let {reportLA,credits,debits,trades} = require('./mongo.js')

// logging
const log = require('dumb-lumberjack')()

/********************************************
 // Modules
 //*******************************************/

module.exports = {
    balances: function () {
        return build_balance_report()
    },
    agent: function () {
        return build_liquidity_agent_report()
    },
    credits: function () {
        return build_binance_credits_report()
    },
    debits: function () {
        return build_binance_debits_report()
    },
    trades: function () {
        return build_binance_trades_report()
    },
    all: function () {
        return build_all_reports()
    },
}


/********************************************
 // Lib
 //*******************************************/

let build_all_reports = async function () {
    let tag = TAG+" | raw_to_csv | "
    try {

        await build_binance_credits_report()
        await build_binance_debits_report()
        await build_binance_trades_report()
        await build_liquidity_agent_report()

        return true
    } catch (e) {
        log.error(tag,e)
    }
}

let build_liquidity_agent_report = async function () {
    let tag = TAG+" | build_balance_report | "
    try {

        //get all arbiter report data
        let allOrders = await reportLA.find()
        log.debug(tag,"allOrders: ",allOrders)


        let result = await raw_to_csv(allOrders," Liquidity-agent-report:")

        return result
    } catch (e) {
        log.error(tag,e)
    }
}

let build_binance_trades_report = async function () {
    let tag = TAG+" | build_balance_report | "
    try {
        // let fields = Object.keys(data[0])

        //get all arbiter report data
        let allOrders = await trades.find()
        log.debug(tag,"allOrders: ",allOrders)


        let result = await raw_to_csv(allOrders," Binance-trades-report:")

        return result
    } catch (e) {
        log.error(tag,e)
    }
}

let build_binance_debits_report = async function () {
    let tag = TAG+" | build_balance_report | "
    try {
        // let fields = Object.keys(data[0])

        //get all arbiter report data
        let allOrders = await debits.find()
        log.debug(tag,"allOrders: ",allOrders)


        let result = await raw_to_csv(allOrders," Binance-debits-report:")

        return result
    } catch (e) {
        log.error(tag,e)
    }
}

let build_binance_credits_report = async function () {
    let tag = TAG+" | build_balance_report | "
    try {
        // let fields = Object.keys(data[0])

        //get all arbiter report data
        let allOrders = await credits.find()
        log.debug(tag,"allOrders: ",allOrders)


        let result = await raw_to_csv(allOrders," Binance-credits-report:")

        return result
    } catch (e) {
        log.error(tag,e)
    }
}

let raw_to_csv = async function (data, title) {
    let tag = TAG+" | raw_to_csv | "
    try {
        // let fields = Object.keys(data[0])
        let fields = []

        // iterate over entire dataset
        // get all keys
        for (let i = 0; i < data.length; i++) {
            let entryFields = Object.keys(data[i])
            for (let j = 0; j < entryFields.length; j++) {
                fields.push(entryFields[j])
            }
        }

        fields = fields.filter(function (elem, pos) {
            return fields.indexOf(elem) == pos
        })

        //const result = new json2csv({ data: data, fields: fields })
        const json2csvParser = new json2csv({fields})
        const result = json2csvParser.parse(data);
        log.info(tag,"result: ",result)

        // write to file
        const filename = title + '.csv'
        await write_file(filename, result)

        // upload to slack
        //await upload_to_slack(filename, config.SLACK_CHANNEL_NAME)
        await upload_to_slack(filename, config.SLACK_CHANNEL_NAME_REPORTS)

        return { success: true }
    } catch (e) {
        log.error(tag,e)
    }
}

const write_file = function (filename, data) {
    const d = when.defer()

    fs.writeFile(filename, data, function (err) {
        if (err) throw err

        d.resolve(true)
    })
    return d.promise
}

const upload_to_slack = function (filename, channel) {
    const d = when.defer()
    let tag = ' | upload_to_slack | '

    slackUp.uploadFile({
        file: fs.createReadStream(filename),
        filetype: 'csv',
        title: filename,
        initialComment: filename,
        channels: channel
    }, function (err, data) {
        if (err) {
            console.error(tag, err)
            d.resolve(false)
        } else {
            console.log('Uploaded file details: ', data)
            d.resolve(true)
        }
    })

    return d.promise
}