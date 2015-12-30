var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', 3000);

app.use('/index.js', express.static(__dirname + '/index.js'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('draw', function(data) {
        socket.broadcast.emit('draw', data);
    });
});

server.listen(app.get('port'), function() {
    console.log("Listening on port " + app.get('port'));
});