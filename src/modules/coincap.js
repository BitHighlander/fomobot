/**
 * Created by highlander on 4/24/16.
 */
/**
 * Created by highlander on 4/23/16.
 */
/**
 * Created by highlander on 3/18/2016.
 */
var when = require('when');
var request = require("request")

let TAG = " | coincap | "

// module.exports = {
// 	rates:function(){
// 		return get_rates()
// 	},
// 	lookup:function(coin,param){
// 		return query_data(coin,param)
// 	}
// }


let lookup = async function (coin,param) {
	let tag = TAG+ " | query_data | "
	let debug = true
	let debug1 = true
	let debug2 = false
	try{
		let rates = await get_rates()
		if(debug2) console.log(tag,"rates: ",rates)

		//name map
		let map = await get_request("http://coincap.io/map")
		if(debug) console.log(tag,"map:",typeof(map))
		map = JSON.parse(map)
		if(debug) console.log(tag,"map:",map)


		//parse array
		let indexByName = {}
		let indexBySymbol = {}
		for (var i = 0; i < map.length; i++) {
			if(debug2) console.log(tag,"map: ",map[i])
			if(debug1) console.log(tag,"map: ",map[i].name)
			if(debug1) console.log(tag,"map: ",map[i].symbol)
			if(map[i]){
				if(map[i].name && map[i].symbol) indexByName[map[i].name.toLowerCase()] = map[i].symbol.toLowerCase()
				if(map[i].name && map[i].symbol) indexBySymbol[map[i].symbol.toLowerCase()] = map[i].name.toLowerCase()
			}
		}

		if(debug1) console.log(tag,"indexByName:",indexByName)
		if(debug1) console.log(tag,"indexBySymbol:",indexBySymbol)

		let lookup
		if(debug) console.log(tag,"coin: ",coin)
		if(coin == 'bitcoin'){
			if(debug) console.log(tag,"bitcoin == ",coin)
		} else {
			if(debug) console.log(tag,"bitcoin != ",coin)
		}
		coin = coin.trim().toLowerCase()

		//
		let symbols = Object.keys(indexBySymbol)
		if(debug1) console.log(tag,"symbols:",symbols)

		let names = Object.keys(indexByName)
		if(debug1) console.log(tag,"names:",names)
		//if(debug) console.log(tag,"bitcoin:",indexByName['bitcoin'])

		let searchNames = names.indexOf(coin.toString())
		//let searchNames2 = names.indexOf('bitcoin')
		if(debug) console.log(tag,"searchNames:",searchNames)
		//if(debug) console.log(tag,"searchNames2:",searchNames2)

		//if given symbol use it!
		if(symbols.indexOf(coin) >= 0){
			if(debug) console.log(tag,"found in indexBySymbol")
			lookup = coin
		} else if(names.indexOf(coin) >= 0){
			//if given name lookup symbol
			if(debug) console.log(tag,"found in indexByName")
			lookup = indexByName[coin]
		}

		if(debug) console.log(tag,"lookup: ",lookup)
		lookup = lookup.toUpperCase()
		if(coin != lookup) return "The price of "+coin+" ("+lookup+") is "+rates[lookup] + " (USD) "
		else return "The price of ("+lookup+") is "+rates[lookup] + " (USD) "
	}catch(e){
		console.error(tag,"ERROR: ",e)
		throw e
	}
}

//primary
var rates = function(){
	var d = when.defer();
	var tag = " | get_status | "

	ccNotify("https://coincap.io")
		.then(function(resp) {
			//console.log(typeof(resp))
			resp = JSON.parse(resp)
			//console.log(resp.length)
			//console.log(resp[0])
			var cc_rates = {}
			for (var i = 0; i < resp.length; i++) {
				//console.log(resp[0])
				//console.log(resp[i])
				//console.log(typeof(resp[i]))
				var data = resp[i]
				cc_rates[data.short] = data.price
			}

			d.resolve(cc_rates)
		})


	return d.promise
}

//lib
var get_request = function(url){
	var d = when.defer()
	var headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/x-www-form-urlencoded'
	}
	var options = {
		url,
		method: 'GET',
		headers: headers
	}
	// Start the request
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			//console.log(body)
			d.resolve(body)
		}
	})
	return d.promise;
}


var ccNotify = function(url){
	var d = when.defer()
	var headers = {
		'User-Agent':       'Super Agent/0.0.1',
		'Content-Type':     'application/x-www-form-urlencoded'
	}
	var options = {
		url: url + "/front",
		method: 'GET',
		headers: headers
	}
	// Start the request
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			//console.log(body)
			d.resolve(body)
		}
	})
	return d.promise;
}

export default {
	rates,
	lookup,
}
