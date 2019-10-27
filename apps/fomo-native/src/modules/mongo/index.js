let TAG = " | (ne)mongo | "


var Datastore = require('nedb-promises')
const schema = require('./schema.js')

let output = {}
let collections = schema.COLLECTIONS
for(let i = 0; i < collections.length;i++){
	let collection = collections[i]
	output[collection] = Datastore.create(collection+'.db')
}

module.exports = exports = output