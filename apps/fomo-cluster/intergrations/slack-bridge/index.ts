
/*

        Redis pub/sub


 */
// log.infoger function
const TAG = 'Slack'
require('dotenv').config()
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"./../../.env"});
require('dotenv').config({path:"../../../.env"});
require('dotenv').config({path:"../../../../.env"});


let log = require("@fomobro/loggerdog-client")()
const {redis,subscriber,publisher} = require("@fomobro/default-redis")

if(!process.env.SLACK_TOKEN) throw Error("slack token not found~! ")
const SlackBot = require('slackbots')
const bot = new SlackBot({
  name:'ccv3',
  token:process.env.SLACK_TOKEN
})


const botName = 'cappy'
const defaultChannelName = "markets"

//if default is private channel
let SLACK_IS_PRIVATE = process.env.SLACK_IS_PRIVATE

const Tokenizer = require('sentence-tokenizer')
const tokenizer = new Tokenizer('reddit')


// app on_start
let usersByIndex:any = {}
let usersByName:any = {}
// let userAccounts = {}

let params = {
  icon_emoji: ':coincap_v2:',
}


// pretty formats JSON
// const pretty = obj => JSON.stringify(obj, null, 2)

// check the slack config to see if we should publish messages in the private
// group or in the public channel
const publishSlackMessage = (
  false
    ? bot.postMessageToGroup
    : bot.postMessageToChannel
).bind(bot)

let tag = " | slackbot | "

bot.on('start', async function() {
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  try {
    let userList = await bot.getUsers()
    //log.info(tag,"userList: ",userList)

    for (let i = 0; i < userList.members.length; i++) {
      usersByIndex[userList.members[i].id] = userList.members[i].name
      usersByName[userList.members[i].name] = userList.members[i].id
      // yield redis.hset(memberArray.members[i].id, "username", memberArray.members[i].name)

      // get user accounts
      // let userAccount = await redis.hgetall(userList.members[i].id)
      // if(!userAccount){
      //     let newAccount = await wallet.create(userList.members[i].id)
      //     userAccounts[userList.members[i].id]= newAccount
      // }
    }

    //publishSlackMessage(defaultChannelName, botName + ' is online', params)
    // views.displayStringToGroup(botName+" is online","balancing")
    log.info(TAG,botName+" is online")
  } catch (e) {
    console.error('ERROR: ', e)
  }
})

// subscribe to redis
subscriber.subscribe('publish')
subscriber.on('message', async function (channel:any, payloadS:string) {
  try {

    let payload = JSON.parse(payloadS)
    log.info('payload: ', payload)

    if (!payload.channel) throw Error('101: invalid payload missing: channel')
    if (!payload.msg) throw Error('101: invalid payload missing: msg')
    if (!payload.view) throw Error('101: invalid payload missing: view')

    let result = await publishSlackMessage(payload.channel, payload.msg, payload.view)
    log.info('result: ', result)

    // TODO if failed re-queue
  } catch (e) {
    console.error('Error: ', e)
  }
})

bot.on('message', async function (data:any) {
  try {
    const debug = true
    const verbose = true

    // const event = data.type
    // const channel = data.channel

    if (verbose) log.info('data-pre:', (data))
    // save event
    if (data.type === 'reconnect_url') return false
    if (data.type === 'presence_change') return false
    if (data.type === 'user_typing') return false

    // is message
    if (data.type === 'message' && usersByIndex[data.user]) {
      if (debug) log.info('checkpoint1')
      // save all messages seen
      // TODO this broken on prod, silent, death
      // let success = await slackInputs.insert(data)
      // if(debug) log.info("success: ",success)
      // if(debug) log.info("checkpoint2")

      if (!data.text) return
      tokenizer.setEntry(data.text)
      let output = tokenizer.getSentences()
      if (verbose) log.info('output: ', output)
      let tokens = tokenizer.getTokens(output)
      if (verbose) log.info('tokens: ', tokens)

      // publish to net
      let user = usersByIndex[data.user]
      let slackInput = { data, user, tokens }

      if (debug) log.info('checkpoint3')
      let result = await publisher.publish('slack', JSON.stringify(slackInput))
      if (debug) log.info('publish result: ', result)
      // add to queue
      // redis.sadd(slackInput)

    }
    return
  } catch (e) {
    console.error('e', e)
    throw e
  }
})

let onExit = function(){
  process.exit(1)
}
setTimeout(onExit,30 * 60 * 1000)
