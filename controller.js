'use strict';

var response = require('./res');
var connection = require('./connection');

exports.index = function(req, res){
    response.ok("REST API Vehicle", res)
}

// get all vehicles data grouping
// output: {status, values: {id, name, created_at, updated_at}}
exports.getAllVehicleBrandGroup = function(req, res){
    connection.query("SELECT vehicle_brand.id, vehicle_brand.name, vehicle_type.name as types FROM vehicle_type JOIN vehicle_brand WHERE vehicle_type.brand_id = vehicle_brand.id", (err, rows, fields) => {
        if (err) throw err;
        response.nested(rows, res)
    });
}