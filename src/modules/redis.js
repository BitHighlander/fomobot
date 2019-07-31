/*

		Electron store redis

		Mapping redis's api to electron store!

		lists
		lpush

		sets
		sadd
		smembers
		scard
		spop



 */

const TAG = " | BOT-Client | "

const redis = require("redis-mock")
const bluebird = require("bluebird")
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const clientRedis = redis.createClient();

let publisher = {}
let subscriber = {}

//manual mapping
clientRedis.get = clientRedis.getAsync


module.exports = {redis:clientRedis, publisher, subscriber}
