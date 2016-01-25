var models = require("./models");
var app = require('express')();
var routes = require('./routes')
var http = require('http').Server(app);
var express = require('express');
app.use(express.static('public'));
var io = require('socket.io')(http);
var ProtoBuf = require("protobufjs")
app.set('port', (process.env.PORT || 8888));
io.sockets.on('connection', function(socket) {
	socket.on('subscribe', function() {
		console.log('joining room');
		socket.join("test");
	})

});

app.get('/', function(req, res) {
});

app.get('/coordinates', function(req, res){
	routes.getCoords(req, res, false, null)
});

app.get('/coordinates2', function(req, res) {
	routes.getCoords(req, res, true, function(buf){
		io.sockets.in("test").emit('message', buf);
		console.log(buf);
	//	console.log(buf.decode);
	})


		

// console.log(test)

});

app.get('/ws', function(req, res) {
	res.sendFile('public/buffers.html', {
		root : __dirname
	})

});

models.sequelize.sync().then(function() {
	http.listen(app.get('port'), function() {
		console.log('Node app is running on port', app.get('port'));
	});
});
