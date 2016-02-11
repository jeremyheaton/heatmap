var routes = require('../routes')
var models = require("../models")
var request = require('request');



var expect = require("chai").expect;

describe("Testing the functions in routes.js", function() {
	describe("Boundary calculations", function() {
		it("calculates the parameters of the coordinates", function() {
			var coords = routes.setBoundries(1, 2, 3, 4)
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
			console.log(data)
			expect(data[0][0]).to.equal(15)
			expect(data[0][1]).to.equal(48)
			expect(data[0][2]).to.equal(0.9305815689031963)
			
			expect(data[1][0]).to.equal(40)
			expect(data[1][1]).to.equal(60)
			expect(data[1][2]).to.equal(0.9136639351151392)
			
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
			request.get('http://localhost:8888/coordinates', function(err, res, body) {
				expect(res.statusCode).to.equal(400);
				expect(res.body).to.equal('You must provide all coordinate paramters');
				done();
			});
		});
	});

});