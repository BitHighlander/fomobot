const Big = require('big.js')

// set current balances
const log = require('@fomobot/loggerdog-client')()

// allow balance calls to be synchronise

class Accounting {
	constructor(redis) {
		if ( !redis ) {
			throw Error("default-redis must be passed to Accounting constructor")
		}
		this.redis = redis
	}

	balance(account, coin) {
		return _balance(account, coin, this.redis)
	}

	credit(account, amount, coin) {
		return _credit(account, amount, coin, this.redis)
	}

	debit(account, amount, coin) {
		return _debit(account, amount, coin, this.redis)
	}


}

module.exports = Accounting

let TAG = ' | accounting | '

//TODO get this data from INIT (not hard coded like a smuck)
let BTC = 100000000
let ETH = 100000000
let LTC = 100000000
let GNT = 100000000
let ATOM = 100000000
let USD = 100

let precision = { BTC, ETH, USD, LTC, GNT, ATOM }
let debug = false

/****************************
 // primary
 //****************************/

const _balance = async function (account, coin, redis) {
	let tag = TAG + ' | balance | '
	try {
		// var debug = false
		if (!account) throw Error('ERROR:BALANCE:101 missing account')
		if (!coin) throw Error('ERROR:BALANCE:102 missing coin type')
		coin = coin.toUpperCase()
		if (!precision[coin]) throw Error('ERROR:BALANCE:103 unknown asset!')
		log.debug(tag, 'coin: ', coin)

		let balance = await redis.hget(account, coin)
		log.debug(tag, 'balance: ', balance)
		if (!balance) return 0
		balance = parseInt(balance, 10) / precision[coin]
		return balance
	} catch (e) {
		console.error(tag, 'ERROR: ', e)
		throw Error('ERROR:BALANCE:100 failed to find balance')
	}
}

const _credit = async function (account, amount, coin, redis) {
	let tag = TAG + ' | credit | '
	let debug = false
	try {
		// let debug = false
		let timeStart = new Date().getTime()

		if (!account) throw Error('ERROR:CREDIT:201 missing account')
		if (!amount) throw Error('ERROR:CREDIT:202 missing amount')
		if (!coin) throw Error('ERROR:CREDIT:204 missing coin type')
		if (amount <= 0) throw Error('ERROR:CREDIT:203 attempted negative credit')
		coin = coin.toUpperCase()
		if (!precision[coin]) throw Error('ERROR:CREDIT:205 unknown asset!')
		log.debug(tag, 'coin: ', coin)

		// prescision
		let atomicicity = Big(precision[coin])
		let amountBig = Big(amount)

		amountBig = amountBig.times(atomicicity)
		log.debug(tag, 'amountBig: ', amountBig.toString())

		// atomic
		let amountCredit = parseInt(amountBig, 10)
		if (amountCredit !== amountBig) console.error(tag, 'amountCredit: ', amountCredit, '  amount: ', amount)
		// if(amountCredit != amountBig) throw'ERROR:CREDIT:206 POTENTIAL PRECISION LOSS! '
		let timeEnd = new Date().getTime()
		log.debug(tag, 'benchmark Math: ', timeEnd - timeStart)

		let success = await redis.hincrby(account, coin, amountCredit)
		log.debug(tag, 'success: ', success)
		if (!success) throw Error('ERROR:CREDIT:205 missing account')

		let timeDone = new Date().getTime()
		log.debug(tag, 'benchmark Redis: ', timeEnd - timeDone)

		return success
	} catch (e) {
		console.error(tag, 'ERROR: ', e)
		throw Error('ERROR:CREDIT:200 failed to credit!')
	}
}

const _debit = async function (account, amount, coin, redis) {
	let tag = TAG + ' | debit | '
	let debug = true
	const get_balance = async function (account, coin) {
		let tag2 = TAG + ' | get_balance | '
		try {
			// let debug = false
			if (!account) throw Error('ERROR:CREDIT:101 missing account')
			if (!coin) throw Error('ERROR:CREDIT:102 missing account')
			coin = coin.toUpperCase()
			if (!precision[coin]) throw Error('ERROR:CREDIT:204 unknown asset!')
			log.debug(tag2, 'coin: ', coin)

			let balance = await redis.hget(account, coin)
			log.debug(tag2, 'balance: ', balance)

			if (!balance) {
				// console.error(tag2,"no balance returned from default-redis for hget ", account, coin)
				return 0
			}
			balance = parseInt(balance, 10) / precision[coin]
			return balance
		} catch (e) {
			if (debug) console.error(tag2, 'ERROR: ', e)
			throw Error('ERROR:CREDIT:100 failed to credit! ')
		}
	}

	try {
		// let debug = false

		if (!account) throw Error('ERROR:CREDIT:301 missing account')
		if (!amount) throw Error('ERROR:CREDIT:302 missing amount')
		if (!coin) throw Error('ERROR:CREDIT:304 missing coin')

		coin = coin.toUpperCase()
		if (!precision[coin]) throw Error('ERROR:CREDIT:106 unknown asset!')

		// atomic
		amount = parseInt(amount * precision[coin], 10)
		log.debug(tag, coin + ' amount: ', amount)
		log.debug(tag, coin + ' account: ', account)
		let balance = await get_balance(account, coin)
		log.debug(tag, coin + ' balance: ', balance)
		balance = parseInt(balance * precision[coin], 10)
		log.debug(tag, coin + ' balance: ', balance)
		log.debug(tag, coin + ' amount: ', amount)
		if (balance < amount) console.error(account, ' ', coin + ' amount:', amount, 'balance: ', balance)
		if (balance < amount) throw Error('OVERDRAFT! balance: ' + balance + ' amount: ' + amount)

		// debit is negitive
		amount = amount * -1
		if (amount > 0) throw Error('ERROR:CREDIT:303 attempted positive debit')
		let amountCredit = parseInt(amount, 10)
		if (amountCredit != amount && debug) console.error(tag, 'amountCredit: ', amountCredit, '  amount: ', amount)
		if (amountCredit != amount) console.error(tag, 'POTENTIAL PRECISION LOSS! ')
		let success = await redis.hincrby(account, coin, amountCredit)
		if (success === 0) return 0
		log.debug(tag, 'success: ', success)
		if (!success) throw Error('ERROR:CREDIT:305 failed to update!')

		return success
	} catch (e) {
		console.error(tag, 'ERROR: ', e)
		throw Error('ERROR:CREDIT:300 failed to debit!')
	}
}
