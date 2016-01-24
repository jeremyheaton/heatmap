"use strict";

module.exports = function(sequelize, DataTypes) {
	var DataPoint = sequelize.define("DataPoint", {
		ipscount : {
			type : DataTypes.DECIMAL

		},
		longitude : {
			type : DataTypes.DECIMAL(10, 4)

		},
		latitude : {
			type : DataTypes.DECIMAL(10, 4)

		}
	});
	return DataPoint;
};
