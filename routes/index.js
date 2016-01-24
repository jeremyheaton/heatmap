var models = require("../models");
exports.saveDataPoint = function(point) {
	models.DataPoint.create({
        ipscount:  point.ipcount,
        longitude:  point.longitude,
        latitude: point.latitude
    }).then(function(data){
      
    }).catch(function(error){
    console.log(error);
    });
};

exports.getCoordinates = function(req, res) {
    models.DataPoint.findAll().then(function(data){
        res.json(data);
    });
};
//function to fetch results for get request
exports.getCoords = function(req, res){
		var boundary = exports.setBoundries(Number(req.param('corner1lat')),Number(req.param('corner1lng')),
					Number(req.param('corner2lat')), Number(req.param('corner2lng')))
					
					 models.sequelize.query('SELECT "data".longitude, "data".latitude, "data".ipscount FROM ('
						 		+ ' SELECT * FROM "DataPoints" as "data"'
						 		+ ' WHERE "data".longitude BETWEEN '
						 		+ boundary.xlowerbound + ' and ' + boundary.xupperbound + ') data'
						 		+ ' WHERE "data".latitude BETWEEN '
						 		+ boundary.ylowerbound + ' and '
						 		+ boundary.yupperbound + ';', { type: models.sequelize.QueryTypes.SELECT}).then(function(data) {
						 			res.json(exports.makeDataArray(data));
						 		});
					
//		exports.searchCoords(boundary,  function(data) {
//					res.json(exports.makeDataArray(data))
//		})
	}

exports.setBoundries = function setBoundries(corner1lat, corner1lng, corner2lat, corner2lng) {
	var boundary = new Object();
		boundary.ylowerbound = corner1lat > corner2lat ?  corner2lat : corner1lat
		boundary.yupperbound = corner2lat > corner1lat ? corner2lat : corner1lat
		boundary.xlowerbound = corner1lng > corner2lng ? corner2lng : corner1lng
		boundary.xupperbound = corner2lng > corner1lng ?  corner2lng : corner1lng
	return boundary;
}

exports.makeDataArray = function makeData(data){
	
	var array=[]
	for ( var attributename in data) {
		var point =[]
		point.push(data[attributename].latitude,data[attributename].longitude,Number(data[attributename].ipscount));
		array.push(point);
	}
	return array;
}
// Function that searches the db for coordinates of a square. 
exports.searchCoords = function searchCoords(boundary, callback){
	 models.sequelize.query('SELECT "data".longitude, "data".latitude, "data".ipscount FROM ('
		 		+ ' SELECT * FROM "DataPoints" as "data"'
		 		+ ' WHERE "data".longitude BETWEEN '
		 		+ boundary.xlowerbound + ' and ' + boundary.xupperbound + ') data'
		 		+ ' WHERE "data".latitude BETWEEN '
		 		+ boundary.ylowerbound + ' and '
		 		+ boundary.yupperbound + ';', { type: models.sequelize.QueryTypes.SELECT}).then(function(data) {
		 			callback(data);
		 		});

		 		
}