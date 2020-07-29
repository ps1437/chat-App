const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
var path = require('path');

const PORT = process.env.PORT || 8888;


app.use(bodyParser.urlencoded({ extended: true }));
var userList = {};
const rooms ={
 Comedy:{},
 TimePass:{},
 Education:{},
 
 

};


app.set('View Engine', '/views');
app.post('/join', function(req, res) {
    rooms[req.body.roomId] ={users:{}}
     res.redirect(req.body.roomId);
});

app.get('/:roomId', function(req, res) {
    res.render('Chat.ejs',{roomId:req.params.roomId});
});

app.get('/room', function(req, res) {
    res.render('Chat.ejs');
});

app.get('/', function(req, res) {
    res.render('Join.ejs' ,{rooms:rooms});
});


io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        // if(!userList[username.toUpperCase()]){
        //     userList[username.toUpperCase()] ="A";
        // }
        io.emit('is_online',  username +" Join the Chat",userList);
    
    });

    socket.on('disconnect', function(username) {
         delete userList.username;
        io.emit('is_online', username +" Left the Chat",userList);
    })

    socket.on('typing', function() {
    
       io.emit('chat_message', socket.username +" is Typing ",socket.username);
   })

    socket.on('chat_message', function(message) {
        io.emit('chat_message',  message,socket.username);
    });

});

http.listen(PORT, function() {
    console.log(`listening on *:${PORT}`);
});