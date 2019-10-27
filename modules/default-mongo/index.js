
/*
	Default redis tool
				- Highlander

	Requirements:

	* Allow production k8 HA cluster deployments
	*

	TODO
	* Allow override via init


	NOTE! this ASSUMES a production CLUSTER deployment (because only scrubs would use a single nedb in production


	DEFAULT:  HELM deployment with a specified nedb cluster NAME

	helm install --name nedb-ha-cluster stable/mongodb-replicaset

 */




let TAG = ' | nedb | '
const monk = require('monk')

let CLUSTER_NAME = process.env["MONGO_CLUSTER_NAME"] || "nedb-ha-cluster"
let HOSTS
let OPTIONS

//if prod hosts
if(process.env['NODE_ENV'] === "production"){
	HOSTS = [
		{
			ip: 'nedb-ha-cluster-mongodb-replicaset-0.'+CLUSTER_NAME+'-mongodb-replicaset.default.svc.cluster.local',
			port: 27017,
		}, {
			ip: 'nedb-ha-cluster-mongodb-replicaset-1.'+CLUSTER_NAME+'-mongodb-replicaset.default.svc.cluster.local',
			port: 27017
		},
		{
			ip:'nedb-ha-cluster-mongodb-replicaset-2.'+CLUSTER_NAME+'-mongodb-replicaset.default.svc.cluster.local',
			port:27017
		}
	]
	OPTIONS = {
		replicaSet: 'rs0'
	}
}else{
	HOSTS = [
		{
			ip: process.env['MONGO_HOST']  || '127.0.0.1',
			port: 27017,
		},
	]
	OPTIONS = {
		// replicaSet: 'rs01'
	}
}

let config = {}
config.MONGO = {
	HOSTS,
	DB: process.env['MONGO_DB_NAME'] || 'pioneer',
	OPTIONS,
}


const hosts = config.MONGO.HOSTS
const db = config.MONGO.DB
const options = config.MONGO.OPTIONS

function _buildConnectionString (hosts, db) {
	if (!hosts && hosts.length > 0) {
		throw new Error('No nedb hosts configured! See configs/example_dbConfig.js')
	}

	let str = hosts.map(host => host.ip + ':' + host.port).join(',')
	str += '/' + (db || '')

	return str
}

const connectionString = _buildConnectionString(hosts, db)

const connection = monk(connectionString, options, err => {
	if (err) {
		console.error(TAG, `Error connecting to mongo!`, err)
		throw new Error(err)
	} else {
		console.log(TAG, `ONLINE! Successfully connected to mongo`)
	}
})

// collections



module.exports = exports = connection
