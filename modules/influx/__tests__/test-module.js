//Read from

// no auth
const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/mydb');
