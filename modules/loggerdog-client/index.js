/*
            Logger-dog
        A data-dog logger system
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
       Defaults to a basic logger if no ENV found

       Publish to datadog if DATADOG_API found

       Publish to redis if REDIS_CONNECTION found

 */

let dog = require("./modules/datadog")
const clc = require('cli-color')

const LOG_LEVELS = {
    EMERG: { val: 0, label: 'EMERG', color: clc.magentaBright },
    ALERT: { val: 1, label: 'ALERT', color: clc.magentaBright },
    CRIT: { val:  2, label: 'CRIT', color: clc.redBright },
    ERROR: { val: 3, label: 'ERROR', color: clc.redBright },
    WARN: { val:  4, label: 'WARN', color: clc.xterm(208) }, // orange
    NOTICE: { val: 5, label: 'NOTICE', color: clc.yellowBright },
    VERBOSE: { val: 6, label: 'VERBOSE', color: clc.cyanBright },
    INFO: { val: 6, label: 'INFO', color: clc.cyanBright },
    DEBUG: { val: 7, label: 'DEBUG', color: clc.greenBright },
    DEBUGV: { val: 8, label: 'DEBUG', color: clc.greenBright },
    DEBUGVV: { val: 9, label: 'DEBUG', color: clc.greenBright }
}

const DEFAULT_LOG_LEVEL = process.env['DEFAULT_LOG_LEVEL'] || 'INFO'

function _extractContext(stack, depth) {
    try {
        let arr = stack.split('\n')
        let chunks = arr[depth].split('/')
        let business = chunks[chunks.length - 1] // ha ha!
        let matches = business.match(/^([^:]+):(\d+):(\d+)/i)

        let filename = matches[1]
        let line = matches[2]
        let pos = matches[3]

        return { filename, line, pos }
    } catch (ex) {
        console.error(`WARNING: unable to extract logging context`, ex)
        return { filename: 'unknown' }
    }
}

function _getContextString() {
    let stack = new Error().stack
    // console.log(`stack`, stack)
    let { filename, line, pos } = _extractContext(stack, 3)
    return `[${filename}:${line}:${pos}]`
}

class Logger {
    constructor() {
        let stack = new Error().stack
        // console.log(`stack`, stack)
        let ctx = _extractContext(stack, 3)

        this._tag = ctx.filename

        for ( let lvl in LOG_LEVELS ) {
            this[lvl.toLowerCase()] = this._log.bind(this, lvl)
        }

        this._setLogLevel()
    }

    _setLogLevel() {
        let tag = this._tag.split('.')[0] // strip out suffix
        tag = tag.toUpperCase().replace('-', '_') // CAPITALS_AND_UNDERSCORES

        let level = process.env['LOG_LEVEL_'+tag]

        if ( level && LOG_LEVELS[level] !== undefined ) {
            this._level = LOG_LEVELS[level].val
        } else {
            this._level = LOG_LEVELS[DEFAULT_LOG_LEVEL].val
        }
    }

    _log(level, ...args) {
        if ( this._level >= LOG_LEVELS[level].val ) {
            let dt = new Date().toISOString().replace('T', ' ')
            let ctx = _getContextString()
            let label = LOG_LEVELS[level].label
            let color = LOG_LEVELS[level].color
            console.log(dt, color(label), ctx, ...args)

            if(process.env['DATADOG_API']){
                if(level <= 3 ){
                    //Error
                    dog.error(args[0],args[1],args[2])
                }else{
                    //info
                    dog.info(args[0],args[1],args[2])
                }
            } else {
                //datadog not enabled
            }

            // if(process.env['REDIS_LOGGING']){
            //     const {publisher} = require('@fomobro/default-redis')
            //     publisher.publish("log.info",JSON.stringify({hostname:os.hostname(),context:ctx,tag:args[0],payload:args[1],object:args[2]}))
            // }


        }
    }
}

module.exports = function() {
    return new Logger()
}
