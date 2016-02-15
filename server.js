var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var favicon = require('serve-favicon');
var logger = require('morgan');

app.set('port', 3000);

app.use('/', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/favicon.png'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(logger('dev'));

io.on('connection', function(socket) {
	socket.on('disconnect', function() {
		console.log('* User left');
		io.emit('leave', socket.username);
	});
	socket.on('join', function(nick) {
		console.log('* User joined');
		socket.username = nick;
		io.emit('join', nick);
	});
    socket.on('draw', function(data) {
        io.emit('draw', data);
    });
    socket.on('msg', function(postinfo) {
    	io.emit('msg', postinfo);
    });
});

server.listen(app.get('port'), function() {
    console.log("Listening on port " + app.get('port'));
});