var models = require("./models");
var app = require('express')();
var routes = require('./routes')
var http = require('http').Server(app);
var express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.set('port', (process.env.PORT || 8888));

app.get('/', function(req, res) {
});
app.get('/coordinates', routes.getCoords);

app.get('/delete', routes.getCoords);

models.sequelize.sync().then(function() {
	http.listen(app.get('port'), function() {
		console.log('Node app is running on port', app.get('port'));
	});
});
