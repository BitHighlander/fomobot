/*


	Mongo



 */


let connection = require('../index')

let usersDB = connection.get('users')
let txsDB = connection.get('transactions')

usersDB.createIndex({id: 1}, {unique: true})
txsDB.createIndex({txid: 1}, {unique: true})


/*
read
 */
txsDB.insert({txid:"foo"})
	.then(function(resp){
		console.log("resp: ",resp)
	})

/*
write
 */
txsDB.findOne({txid:"foo"})
	.then(function(resp){
		console.log("resp: ",resp)
	})