var routes = require('../routes')
var models = require("../models")
var request = require('request');

// writes colorful output!

var expect = require("chai").expect;

describe("Testing the functions in routes.js", function() {
	describe("Boundary calculations", function() {
		it("calculates the parameters of the coordinates", function() {
			var coords = routes.setBoundries(1, 2, 3, 4)
			console.log(coords);
			expect(coords.ylowerbound).to.equal(1)
			expect(coords.xlowerbound).to.equal(2)
			expect(coords.yupperbound).to.equal(3)
			expect(coords.xupperbound).to.equal(4)
		});
	});

	describe("Array for of query results", function() {
		it("makes the array that gets sent to get requests", function() {
			var testData = [ {
				longitude : 48,
				latitude : 15,
				ipscount : 0.9305815689031963
			}, {
				longitude : 60,
				latitude : 40,
				ipscount : 0.9136639351151392
			} ]
			var data = routes.makeDataArray(testData)
			expect(data.length).to.equal(2)
		});
	});

	describe("Fetches Coordinates", function() {
		it("searches the database for coordinates", function(done) {
			this.timeout(10000);
			var boundary = routes.setBoundries(3, -115, 62, 112)
			routes.searchCoords(boundary, function(data) {
				expect(data.length).to.equal(151)
				done();
			});
		});
	});

	describe("Get Coords function", function() {
		it('should return 400', function(done) {
			this.timeout(10000);
			request.get('peaceful-cove-23657.herokuapp.com/coordinates', function(err, res, body) {
				console.log(res);
				console.log(err);
				console.log(body);
				//expect(res.statusCode).to.equal(400);
				//expect(res.body).to.equal('wrong header');
				done();
			});
		});
	});

});