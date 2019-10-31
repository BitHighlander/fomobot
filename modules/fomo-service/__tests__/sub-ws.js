
require("dotenv").config()
require("dotenv").config({path:'../../../.env'})
var io = require('socket.io-client');


console.log(process.env['WS_PIONEER'])
var socket = io.connect(process.env['WS_FOMO_SERVICE'], {reconnect: true, rejectUnauthorized: false});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('message', function (message) {
    console.log('message: ',message);
});

socket.on('events', function (message) {
    //console.log('event: ',message);
    message = JSON.parse(message)
    if(message.event === "new block"){
        console.log(message)
    }

});

// socket.on('message', function (message) {
//     console.log('message: ',message);
// });
//
// socket.on('message', function (message) {
//     console.log('message: ',message);
// });


//socket.emit('message', 'me', 'test msg');
