
/*
 Since there are different user types, config requires an order of precedence
 1st: setupConfig,
 2nd: environment,
 3rd: hard-coded URLs
*/

let config = {
    NODE_ENV: process.env['NODE_ENV'] || 'dev',

    // signing privkey
    AGENT_BTC_MASTER: process.env['AGENT_BTC_MASTER'] || '',
    AGENT_BTC_SIGNING_PRIVKEY: process.env['AGENT_BTC_SIGNING_PRIVKEY'] || '',

}

module.exports = config
