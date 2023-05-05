'use strict';

var response = require('./res');
var connection = require('./connection');

exports.index = function(req, res){
    response.ok("Vehicle RestAPI", res)
}

//Mengambil seluruh data Kendaraan dan melakukan Grouping
exports.ambilDataKendaraan = function(req, res){
    connection.query("SELECT vehicle_brand.id, vehicle_brand.name, vehicle_type.name as types FROM vehicle_type JOIN vehicle_brand WHERE vehicle_type.brand_id = vehicle_brand.id",
    function(error, rows){
        if(error){
            console.log(error)
        } else{
            response.nested(rows, res);
        }
    });
}