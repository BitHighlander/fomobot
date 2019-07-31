const Poloniex = require('poloniex-api-node');
const TAG = " | POLONIEX | "

let coinColors = require("../renderer/assets/coins.js")
console.log(coinColors)


function round_number(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

let getBalances = async function (publicKey,privateKey) {
	let tag = TAG + " | getBalances | "
	let debug = true
	try {
		let output = {
			labels: [],
			datasets: [{
				label: TAG+' Balances ',
				backgroundColor: [],
				data: []
			}]
		}

		if(debug) console.log("publicKey: ",publicKey)
		if(debug) console.log("privateKey: ",privateKey)

		let poloniex = new Poloniex(publicKey,privateKey, { socketTimeout: 15000 })
		let balances = await poloniex.returnBalances()

		//get tickers for conversion
		let tickers = await poloniex.returnTicker()
		if(debug) console.log("tickers: ",tickers)

		let totalValueBTC = 0
		let valueMapBTC = {}
		let assets = Object.keys(balances)
		for(let i = 0; i < assets.length; i++){
			let asset = assets[i]
			//if(debug) console.log("asset: ",asset)
			let assetBalance = balances[asset]
			if(parseFloat(assetBalance) > 0){
				if(debug) console.log("assetBalance: ",assetBalance)

				//get rate btc

				if(!tickers["BTC_"+asset] && asset === "BTC"){
					//use native

					output.labels.push(asset)
					assetBalance = round_number(assetBalance,8)
					totalValueBTC = totalValueBTC + assetBalance
					valueMapBTC[asset] = assetBalance
				} else if(!tickers["BTC_"+asset]){
					if(debug) console.log("No rate for asset: ",asset)
				}else{
					let rateBTC = tickers["BTC_"+asset].highestBid
					if(debug) console.log("rateBTC: ",rateBTC)

					//get value btc
					let valueBTC = rateBTC * assetBalance
					valueBTC = round_number(valueBTC,8)
					if(debug) console.log("valueBTC: ",valueBTC)
					totalValueBTC = totalValueBTC + valueBTC
					valueMapBTC[asset] = valueBTC
				}

			}
		}

		//build chart
		if(debug) console.log("valueMapBTC: ",valueMapBTC)
		if(debug) console.log("totalValueBTC: ",totalValueBTC)

		//get percentages
		let percentages = {}
		for(let i = 0; i < Object.keys(valueMapBTC).length; i++){
			let asset = Object.keys(valueMapBTC)[i]
			if(debug) console.log("asset: ",asset)
			let percent = (parseFloat(valueMapBTC[asset]) / round_number(totalValueBTC,8)) * 100
			percent = parseInt(percent)

			if(percent > 0){
				//percentages
				percentages[asset] = percent

				//push to chart
				output.labels.push(asset)
				let color = coinColors[asset]
				if(!color) color = "#5C6BC0"
				output.datasets[0].backgroundColor.push(color)
				output.datasets[0].data.push(percent)
			}

		}
		if(debug) console.log("percentages: ",percentages)



		return output
	} catch (error) {
		console.error(tag,"error: ",error)
		return false
	}
}



export default {
	getBalances
}


// poloniex.returnTicker().then((ticker) => {
// 	console.log(ticker);
// }).catch((err) => {
// 	console.log(err.message);
// });