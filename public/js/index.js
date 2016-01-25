
		
		

var currentBox;
var map = L.map('map', {
	drawControl : true,
	PolylineOptions : false,
	PolygonOptions : false,
	CircleOptions : false,
	MarkerOptions : false
}).setView([ 38, -48 ], 2);

var heat = L.heatLayer([], {
	max:.0003,
	radius : 35,
	minOpacity : .25
}).addTo(map);

var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

map.on('draw:created', function(e) {
	if (currentBox) {
		map.removeLayer(currentBox);
	}

	var type = e.layerType, layer = e.layer;
	if (type === 'rectangle') {
		currentBox = e.layer
		sendCoords(layer.getLatLngs()[0], layer.getLatLngs()[2]);
	}

	map.addLayer(layer);
});

function sendCoords(corner1, corner2) {
	$.ajax({
		url : '/coordinates2?corner1lng=' + corner1.lng + "&corner1lat="
				+ corner1.lat + '&corner2lng=' + corner2.lng + "&corner2lat="
				+ corner2.lat,
		success : function(response) {
		//	console.log(response)
			heat.setLatLngs(response)

		}
	});
}

