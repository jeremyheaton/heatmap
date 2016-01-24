var models = require("./models");
var fs = require('fs');
var routes = require('./routes')
var parse = require('csv-parse');
var async = require('async');
var dataPoint = require(__dirname + '/' + 'datapoint.js');
var Sequelize = require("sequelize");
var inputFile = 'GeoLiteCityv6.csv';
var alasql = require("alasql");
models.sequelize.sync().then(
		models.DataPoint.drop();
		function() {
			var parser = parse({
				delimiter : ','
			}, function(err, data) {
				var normalizeData = []
				for ( var attributename in data) {
					var point = new dataPoint(Number(
							data[attributename][3], 10 -
							data[attributename][2], 10),
							Number(data[attributename][7]),
							Number(data[attributename][8]))
					normalizeData.push(point);
				}

				normalize(group(normalizeData), getMax(group(normalizeData)),
						getMin(group(normalizeData)));

			});

			fs.createReadStream(inputFile).pipe(parser);

		});

function getMax(array) {
	return Math.max.apply(Math, array.map(function(o) {
		return Log(o.ipcount)
	}))
}
function getMin(array) {
	return Math.min.apply(Math, array.map(function(o) {
		return Log(o.ipcount)
	}))
}

function group(data) {
	return alasql(
			'SELECT longitude, latitude, SUM(ipcount) AS ipcount \
				FROM ? GROUP BY longitude, latitude',[ data ]);
}

function normalize(array, max, min) {

	for ( var point in array) {
		array[point].ipcount = (Log(array[point].ipcount)) / (max)
		routes.saveDataPoint(array[point]);
	}
}

function Log(n) {
	return Math.log(n)
}
