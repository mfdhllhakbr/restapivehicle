var connection = require('../connection');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');

// register user
exports.register = function(req, res){
    var post = {
        name: req.body.name,
        password: md5(req.body.password),
        is_admin: req.body.is_admin
    }

    var query = "INSERT INTO ?? SET ?";
    var table = ["users"];
    query = mysql.format(query, table);
    connection.query(query, post, function(err, rows){
        if (err) throw err
        response.ok("Success Create A New User", res)
    });
}

// login user
exports.login = function(req, res){
    var post = {
        name: req.body.name,
        password: req.body.password
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["users", "name", post.name, "password", md5(post.password)];
    query = mysql.format(query, table);

    connection.query(query, post, function(err, rows){
        if (err) throw err;
        if (rows.length == 1){
            var token = jwt.sign({rows}, config.secret, {
                expiresIn: 300 // 300 seconds, just to make sure is it expired soon
            });
            user_id = rows[0].id;

            var data = {
                user_id: user_id,
                access_token: token,
            }
            
            connection.query("INSERT INTO access_token (user_id, token) VALUES (?, ?)", [data.user_id, data.access_token], function(err, rows){
                if(err) throw err;
                 res.json({
                    success: true,
                    message: "Token Generated.",
                    token: token,
                    current_user: data.user_id
                 });
            });
        } else {
            response.bad("User Not Found or Wrong Password.", res);
        }
    });
}

// get all user data *ADMIN
exports.getAllUser = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT * FROM users", (err, rows, fields) => {
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// delete user data *ADMIN
exports.deleteUser = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM users WHERE id=?", [id], (err, rows, fields) => {
        if (err) throw err;
        response.ok("Success Delete Data User ID: " + id, res)
    });
}

//-----------------------------------------------------------------------------------BRAND
// get all vehicles brand data
exports.getAllVehicleBrand = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT * FROM vehicle_brand", (err, rows, fields) => {
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// add vehicle brand data (*ADMIN)
exports.postVehiclesBrand = function(req, res){
    var name = req.body.name;
    connection.query("INSERT INTO vehicle_brand (name) VALUES (?)", [name],
    function(err, rows, fields){ 
        if (err) throw err;
        response.ok("Success Create Vehicle Brand", res);
    });
}

// change data according ID vehicle brand (*ADMIN)
exports.patchVehiclesBrand = function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    connection.query("UPDATE vehicle_brand SET name=? WHERE id=?", [name, id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Update Vehicle Brand", res);
    });
}

// delete data according ID vehicle brand (*ADMIN)
exports.deleteVehiclesBrand = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM vehicle_brand WHERE id=?", [id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Delete Data Vehicle Brand ID: " + id, res);
    });
}

//------------------------------------------------------------------------------TYPE
// get all vehicles data grouping
exports.getAllVehicleTypeGroup = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT vehicle_brand.id as brand_id, vehicle_brand.name, vehicle_type.name as types FROM vehicle_type JOIN vehicle_brand WHERE vehicle_type.brand_id = vehicle_brand.id", (err, rows, fields) => {
        if (err) throw err;
        response.nested(rows, res);
    });
}

// get vehicles type
exports.getVehiclesType = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT * FROM vehicle_type;", function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// filter get type of brand id
exports.getVehiclesTypeBrandID = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    var id = req.params.id;
    connection.query("SELECT * FROM vehicle_type WHERE brand_id=?", [id], function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// create types of which brand (*ADMIN)
exports.postVehiclesType = function(req, res){
    var name = req.body.name;
    var brand_id = req.body.brand_id;
    connection.query("INSERT INTO vehicle_type (name, brand_id) VALUES (?, ?)", [name, brand_id],
    function(err, rows, fields){ 
        if (err) throw err;
        response.ok("Success Create Vehicle Types", res);
    });
}

// change data according ID vehicle type (*ADMIN)
exports.patchVehiclesType = function(req, res){
    var id = req.body.id;
    var brand_id = req.body.brand_id;
    var name = req.body.name;
    if (!brand_id){
        connection.query("UPDATE vehicle_type SET name=? WHERE id=?", [name, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Types", res);
        });
    } else if (!name){
        connection.query("UPDATE vehicle_type SET brand_id=? WHERE id=?", [brand_id, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Types", res);
        });
    } else {
        connection.query("UPDATE vehicle_type SET name=?, brand_id=? WHERE id=?", [name, brand_id, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Types", res);
        });
    }
}

// delete data according ID vehicle brand (*ADMIN)
exports.deleteVehiclesType = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM vehicle_type WHERE id=?", id,
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Delete Data Vehicle Type ID: " + id, res);
    });
}

//-----------------------------------------------------------------------------------MODEL
// get vehicle model
exports.getVehiclesModel = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT * FROM vehicle_model", function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// filter get vehicle model with type id
exports.getVehiclesModelTypeID = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    var id = req.params.id;
    connection.query("SELECT * FROM vehicle_model WHERE type_id=?", id, function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit)
    });
}

// create models of which brand
exports.postVehiclesModel = function(req, res){
    var name = req.body.name;
    var type_id = req.body.type_id;
    connection.query("INSERT INTO vehicle_model (name, type_id) VALUES (?, ?)", [name, type_id],
    function(err, rows, fields){ 
        if (err) throw err;
        response.ok("Success Create Vehicle Model", res);
    });
}

// change data according ID vehicle model
exports.patchVehiclesModel = function(req, res){
    var id = req.body.id;
    var type_id = req.body.type_id;
    var name = req.body.name;
    if (!type_id){
        connection.query("UPDATE vehicle_model SET name=? WHERE id=?", [name, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Models", res);
        });
    } else if (!name){
        connection.query("UPDATE vehicle_model SET type_id=? WHERE id=?", [type_id, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Models", res);
        });
    } else {
        connection.query("UPDATE vehicle_model SET name=?, type_id=? WHERE id=?", [name, type_id, id],
        function(err, rows, fields){
            if (err) throw err;
            response.ok("Success Update Vehicle Models", res);
        });
    }
}

// delete data according ID vehicle type (*ADMIN)
exports.deleteVehiclesModel = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM vehicle_model WHERE id=?", [id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Delete Data Vehicle Model ID: " + id, res);
    });
}

//-----------------------------------------------------------------------------------YEAR
// get vehicle year
exports.getVehiclesYear = function(req, res){
    connection.query("SELECT * FROM vehicle_year", function(err, rows){
        if (err) throw err;
        response.ok(rows, res);
    });
}

// filter get vehicle year by ID
exports.getVehiclesYearByID = function(req, res){
    var id = req.params.id;
    connection.query("SELECT * FROM vehicle_year WHERE id=?", id, function(err, rows){
        response.ok(rows, res);
    })
}

// create years (*ADMIN)
exports.postVehiclesYear = function(req, res){
    var year = req.body.year;
    connection.query("INSERT INTO vehicle_year (year) VALUES (?)", year,
    function(err, rows, fields){ 
        if (err) throw err;
        response.ok("Success Create Vehicle Year", res);
    });
}

// change data according ID year (*ADMIN)
exports.patchVehiclesYear = function(req, res){
    var id = req.body.id;
    var year = req.body.year;
    connection.query("UPDATE vehicle_year SET year=? WHERE id=?", [year, id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Update Vehicle Year", res);
    });
}

// delete data according ID year (*ADMIN)
exports.deleteVehiclesYear = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM vehicle_year WHERE id=?", [id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Delete Data Vehicle Year ID: " + id, res);
    });
}

//-----------------------------------------------------------------------------------PRICELIST
// get vehicle pricelist
exports.getPricelist = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    connection.query("SELECT pricelist.id, pricelist.code, vehicle_model.name, vehicle_model.type_id, vehicle_year.year, pricelist.price FROM pricelist JOIN vehicle_year JOIN vehicle_model WHERE pricelist.year_id = vehicle_year.id AND pricelist.model_id = vehicle_model.id;", function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// filter get vehicle pricelist by year
exports.getPricelistSameYear = function(req, res){
    const page = req.query.page;
    const limit = req.query.limit;

    var year = req.params.year;
    connection.query("SELECT pricelist.id, vehicle_model.name, vehicle_model.type_id, vehicle_year.year, pricelist.price FROM pricelist JOIN vehicle_year JOIN vehicle_model WHERE pricelist.year_id = vehicle_year.id AND pricelist.model_id = vehicle_model.id AND vehicle_year.year=?", year, function(err, rows){
        if (err) throw err;
        response.paginate(rows, res, page, limit);
    });
}

// create pricelist of which model and year (*ADMIN)
exports.postPricelist = function(req, res){
    var code = req.body.code;
    var model_id = req.body.model_id;
    var year_id = req.body.year_id;
    var price = req.body.price;

    connection.query("INSERT INTO pricelist (code, price, year_id, model_id) VALUES (?, ?, ?, ?)", [code, price, year_id, model_id],
    function(err, rows, fields){ 
        if (err) throw err;
        response.ok("Success Create Vehicle Pricelist", res);
    });
}

// change data according ID pricelist (*ADMIN)
exports.patchPricelist = function(req, res){
    var id = req.body.id;
    var price = req.body.price;
    connection.query("UPDATE pricelist SET price=? WHERE id=?", [price, id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Update Vehicle Price", res);
    });
}

// delete data according ID pricelist (*ADMIN)
exports.deletePricelist = function(req, res){
    var id = req.body.id;
    connection.query("DELETE FROM pricelist WHERE id=?", [id],
    function(err, rows, fields){
        if (err) throw err;
        response.ok("Success Delete Data Vehicle Pricelist ID: " + id, res);
    });
}