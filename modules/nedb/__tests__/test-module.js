 let nedb = require("../index.js")



let schema = {
 COLLECTIONS:[
     'cosmos-transactions',
 ],
 INDEXES:{
     'cosmos-transfers':'txid',
 }
}

 nedb.init(schema,'/home/highlander/.fomobro')

let tx = {"type":"transfer","events":[{"account":"citadel","address":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","type":"send","amount":-10000}],"xpub":"xpub6DW8dyzip1P1HK1ZRQJwYzLFJrd11eX2nMgaXQtWJoP2mwUpzUMfzR9cUZsvPELJhyuPyL8Addfo9AhpQMqp4CrFynuqAf3yRcbEA1AggZe","date":1570992791565,"network":"ATOM","height":1776686,"txid":"BF375079D902D5EE5F64D024796039E3B7DF57DE642D30D9FD37D0A54774AEE5","status":"confirmed","event":"transaction","_id":"IkzRbACklilsuM5Y"}

 //save tx

 let dbs = nedb.db()
 console.log(dbs)

 let txDB = dbs['cosmos-transactions']
 console.log(txDB)


 txDB.insert(tx)
     .then(function(resp){
         console.log(resp)
         txDB.find()
             .then(function(resp){
                console.log(resp)
            })
     })

 //read tx

// datastore['cosmos-transactions'].find()
//     .then(function(resp){
//     console.log(resp)
//     })


