const BitMEXClient = require('bitmex-realtime-api');

// See 'options' reference below
// const client = new BitMEXClient({testnet: true});
const client = new BitMEXClient();

client.addStream('XBTUSD', 'trade', function (data, symbol, tableName) {
    // Do something with the table data...
    //console.log(data, symbol, tableName)


    //console.log("data: ",data)
    //console.log("tableName: ",tableName)
    //console.log("data: ",data.length)

    let clean = []
    for(let i = 0; i < data.length; i++){
        let tradeInfo = data[i]

        console.log("tradeInto: ",tradeInfo)

        //let price
        let price = tradeInfo.markPrice
        let amount = tradeInfo.size
        console.log("price: ",price)
        console.log("amount: ",amount)
    }

});
