/*
	Simple yet powerfull native database

 */

let TAG = " | (ne)nedb | "


const Datastore = require('nedb-promises')

let DATABASES = {}

module.exports = {
	init:function (schema,directory) {
		let output = {}
		let collections = schema.COLLECTIONS
		for(let i = 0; i < collections.length;i++){
			let collection = collections[i]
			DATABASES[collection] = Datastore.create(directory+'/database/'+collection+'.db')
		}

		let indexes = schema.INDEXES
		for(let i = 0; i < indexes.length;i++){
			let index = indexes[i]
			DATABASES[collection] = Datastore.ensureIndex({fieldname:index})
		}
		return true
	},
	db:function () {
		return DATABASES
	},
}
