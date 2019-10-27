/*
	Default redis tool
				- Highlander

	Requirements:

	* Allow connection import via process_env
	* If connection not found (throw error)
	* If error, don't spam reconnect

	TODO
	* version control schema's (if version mismatch from stored redis value throw error)
	* Allow override via init

 */



/**
 * Created by highlander on 3/6/17.
 */
const TAG = " | REDIS-CONNECTION-MODULE | "
//const log = require("@fomobot/loggerdog-client")()

//mock in tests
let Redis
if(process.env.NODE_ENV === 'test'){
	Redis = require('ioredis-mock');
}else{
	Redis = require("ioredis");
}


let redis
let redisQueue
let publisher
let subscriber

let redisQueue0
let redisQueue1
let redisQueue2


let redis0
let redis1
let redis2

//TODO this only supports 3 nodes :( hardcoded double :( :(
//Blocked by HELM chart not supporting redis_cluster mode (I know! wtf!)

//ask master
// let getMaster = async function(){
// 	let tag = TAG + " | getMaster | "
// 	try{
// 		let isMaster0 = await redis0.role()
// 		if(isMaster0[0] === 'master') {
// 			redis = redis0
// 			redisQueue = redisQueue0
// 		}
// 		let isMaster1 = await redis1.role()
// 		if(isMaster1[0] === 'master') {
// 			redis = redis1
// 			redisQueue = redisQueue1
// 		}
// 		let isMaster2 = await redis2.role()
// 		if(isMaster2[0] === 'master') {
// 			redis = redis2
// 			redisQueue = redisQueue2
// 		}
//
// 		log.info("isMaster0: ",isMaster0)
// 		log.info("isMaster1: ",isMaster1)
// 		log.info("isMaster2: ",isMaster2)
//
// 	}catch(e){
// 		log.error(tag,e)
// 	}
// }
//
// try{
// 	if(process.env.NODE_ENV === 'production' && process.env.REDIS_CLUSTER){
//
// 		log.info(TAG,"Production redis cluster detected")
// 		redis0 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_0)
// 		redis1 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_1)
// 		redis2 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_2)
//
// 		redis0.connect().catch(function (e) {
// 			throw Error("301 Unable to establish connection! wrong number (redis0)")
// 		});
// 		redis1.connect().catch(function (e) {
// 			throw Error("302 Unable to establish connection! wrong number (redis1)")
// 		});
// 		redis2.connect().catch(function (e) {
// 			throw Error("303 Unable to establish connection! wrong number (redis3)")
// 		});
//
//
// 		redisQueue0 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_0)
// 		redisQueue1 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_1)
// 		redisQueue2 = new Redis(process.env.REDIS_CONNECTION_CLUSTER_2)
//
// 		//slaves can both publish and subscribe freely
// 		publisher = new Redis(process.env.REDIS_CONNECTION_CLUSTER_0)
// 		subscriber = new Redis(process.env.REDIS_CONNECTION_CLUSTER_0)
//
// 		//default to 0 on boot (will write error untill getMaster finishes!)
// 		redis = redis0
// 		redisQueue = redisQueue0
// 		getMaster()
//
// 	} else if(process.env.NODE_ENV === 'production'){
// 		log.info("redis PROD HOSTED detected! ")
// 		//managed redis (*cough* sellout)
// 		if(!process.env.REDIS_PORT) throw Error("101: missing config REDIS_PORT ")
// 		if(!process.env.REDIS_HOST) throw Error("102: missing config REDIS_HOST ")
// 		if(!process.env.REDIS_PASSWORD) throw Error("103: missing config REDIS_PASSWORD ")
//
// 		let settings = {
// 			port: process.env.REDIS_PORT, // Redis port
// 			host: process.env.REDIS_HOST, // Redis host
// 			password: process.env.REDIS_PASSWORD,
// 			tls: {
// 				// Refer to `tls.connect()` section in
// 				// https://nodejs.org/api/tls.html
// 				// for all supported options
// 				ca: fs.readFileSync("./cert.pem")
// 			}
// 		}
// 		redis = new Redis(settings)
// 		publisher = new Redis(settings)
// 		subscriber = new Redis(settings)
// 		redisQueue = new Redis(settings)
//
// 		// redis.connect().catch(function (e) {
// 		// 	throw Error("555 Unable to establish connection! wrong number")
// 		// });
// 		// publisher.connect().catch(function (e) {
// 		// 	throw Error("555 Unable to establish connection! wrong number")
// 		// });
// 		// subscriber.connect().catch(function (e) {
// 		// 	throw Error("555 Unable to establish connection! wrong number")
// 		// });
// 		// redisQueue.connect().catch(function (e) {
// 		// 	throw Error("555 Unable to establish connection! wrong number")
// 		// });
//
// 	}else{
		//log.info("redis DEV detected! ")
		//log.info(process.env.REDIS_CONNECTION)
		if(!process.env.REDIS_CONNECTION) throw Error("101: missing redis config!")

		redis = new Redis(process.env.REDIS_CONNECTION)
		publisher = new Redis(process.env.REDIS_CONNECTION)
		subscriber = new Redis(process.env.REDIS_CONNECTION)
		redisQueue = new Redis(process.env.REDIS_CONNECTION)

		// redis.connect().catch(function (e) {
		// 	throw Error("555 Unable to establish connection! wrong number")
		// });
		// publisher.connect().catch(function (e) {
		// 	throw Error("555 Unable to establish connection! wrong number")
		// });
		// subscriber.connect().catch(function (e) {
		// 	throw Error("555 Unable to establish connection! wrong number")
		// });
		// redisQueue.connect().catch(function (e) {
		// 	throw Error("555 Unable to establish connection! wrong number")
		// });
//	}
// }catch(e){
// 	//throw Error("555 Unable to establish connection! wrong number")
// }





module.exports = {redis, publisher, subscriber,redisQueue}
