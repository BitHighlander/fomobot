require("dotenv").config({path:'../../../.env'})
let log = require("../index.js")()

console.log(process.env['REDIS_LOGGING'])

log.info(" | test | ","foo","bar")
