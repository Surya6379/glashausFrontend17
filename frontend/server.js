var express = require('express');
var app = express();
const http = require('http').createServer(app);
var socket = require('socket.io')

var server = http.listen(3000, () => {
    console.log('Listening at port 3000');
});

var io = socket(server);



io.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`)

    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function (data) {
        io.sockets.emit('typing', data);
    });
})

