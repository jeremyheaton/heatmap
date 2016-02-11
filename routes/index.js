var models = require("../models");
var path = require("path")
var ProtoBuf = require("protobufjs")
var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "coordinates.proto"));
var root = builder.build()
CoordHolder = root.CoordHolder;
Coord = root.Coord;
var coordArray = new CoordHolder();

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
// function to fetch results for get request
exports.getCoords = function(req, res, websocket, callback) {
	var pb
	var fish
    if (req.param('corner1lat') && req.param('corner2lat') && req.param('corner2lng') && req.param('corner1lng')) {
        var boundary = exports.setBoundries(Number(req.param('corner1lat')), Number(req.param('corner1lng')),
            Number(req.param('corner2lat')), Number(req.param('corner2lng')))
        exports.searchCoords(boundary, function(data) {
        	if(!websocket){
        		res.json(exports.makeDataArray(data))
        	} else{
        		pb = exports.makeProtoBuff(data)
        		 fish = pb.toArrayBuffer();
        	}
        	try{
        		 callback(fish);
        	}
        		 catch(e){
        		 }
        })
    } else {
    	res.status(400);
    	res.send('You must provide all coordinate paramters');
    }

}
exports.makeProtoBuff = function makeProtoBuff(data){
	var inners = []
	for ( var attributename in data) {
		var point =[]
    	inners.push(new Coord(new Coord.Lat(data[attributename].latitude),
				new Coord.Lng(data[attributename].longitude),
				new Coord.Ipcount(Number(data[attributename].ipscount))));
	}
	return coordArray.setCoords(inners);
}


// function to calculate the boundary values
exports.setBoundries = function setBoundries(corner1lat, corner1lng, corner2lat, corner2lng) {
	var boundary = new Object();
		boundary.ylowerbound = corner1lat > corner2lat ?  corner2lat : corner1lat
		boundary.yupperbound = corner2lat > corner1lat ? corner2lat : corner1lat
		boundary.xlowerbound = corner1lng > corner2lng ? corner2lng : corner1lng
		boundary.xupperbound = corner2lng > corner1lng ?  corner2lng : corner1lng
	return boundary;
}
// function that turns the returned sequelize object into a simple array for
// front end processing
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