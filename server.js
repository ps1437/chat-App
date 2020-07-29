const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8888;
app.set('View Engine', '/views');
app.use(bodyParser.urlencoded({ extended: true }));


var userList = {};

app.post('/join', function(req, res) {
    userList[req.body.username] ="A";
     res.redirect(req.body.username);
});

app.get('/:username', function(req, res) {
    res.render('Chat.ejs',{username:req.params.username});
});


app.get('/', function(req, res) {
    res.render('Home.ejs');
});


io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
         io.emit('is_online',  username +" Join the Chat",userList);
    
    });

    socket.on('disconnect', function(username) {
        delete userList.username;
        io.emit('is_online', socket.username  +" Left the Chat",userList);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message',  message,socket.username);
    });

});

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});