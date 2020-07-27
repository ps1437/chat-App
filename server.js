const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('Chat.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online',  username +" Join the Chat");
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', username +" Left the Chat");
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message',  message,socket.username);
    });

});

const server = http.listen(3000, function() {
    console.log('listening on *:3000');
});