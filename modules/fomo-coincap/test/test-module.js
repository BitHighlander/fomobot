require("dotenv").config({path:"../.env"})
let coincap = require("../index")


// fomo-coincap.assets()
//     .then(function(resp){
//         console.log(resp)
//     })

coincap.history('bitcoin')
    .then(function(resp){
        console.log(resp.data.length)
        let outputPrices = []
        let outputDates = []
        for(let i = 0; i < resp.data.length; i++){
            let entry = resp.data[i]
            outputPrices.push(entry.priceUsd)
            outputDates.push(entry.date)
        }

        console.log(outputPrices)
        console.log(outputDates)
    })
