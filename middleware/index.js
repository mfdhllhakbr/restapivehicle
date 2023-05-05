var express = require('express');
var auth = require('./auth');
const verification = require('./verification');
var route = express.Router();

route.post('/api/v1/register', auth.register);
route.post('/api/v1/login', auth.login);

// get all user (*ADMIN)
route.get('/users', verification(1), auth.getAllUser);

// delete user (*ADMIN)
route.delete('/users/delete', verification(1), auth.deleteUser);

//-----------------------------------------------------------------------------------BRAND
// get all vehicle brand
route.get('/vehicle/brand', verification(), auth.getAllVehicleBrand);

// create vehicle brand (*ADMIN)
route.post('/vehicle/brand/create', verification(1), auth.postVehiclesBrand);

// patch vehicle brand (*ADMIN)
route.patch('/vehicle/brand/patch', verification(1), auth.patchVehiclesBrand);

// delete vehicle brand (*ADMIN)
route.delete('/vehicle/brand/delete', verification(1), auth.deleteVehiclesBrand);

//------------------------------------------------------------------------------------TYPE
// get all types from each brand
route.get('/vehicle/type/brand', verification(), auth.getAllVehicleTypeGroup);

// get vehicle type
route.get('/vehicle/type', verification(), auth.getVehiclesType);

// get vehicle brand id
route.get('/vehicle/type/brand/:id', verification(), auth.getVehiclesTypeBrandID);

// create vehicle type (*ADMIN)
route.post('/vehicle/type/create', verification(1), auth.postVehiclesType);

// patch vehicle type (*ADMIN)
route.patch('/vehicle/type/patch', verification(1), auth.patchVehiclesType);

// delete vehicle brand (*ADMIN)
route.delete('/vehicle/type/delete', verification(1), auth.deleteVehiclesType);

//------------------------------------------------------------------------------------MODEL
// get vehicle model
route.get('/vehicle/model', verification(), auth.getVehiclesModel);

// get vehicle model by type id 
route.get('/vehicle/model/type/:id', verification(), auth.getVehiclesModelTypeID);

// create vehicle model (*ADMIN)
route.post('/vehicle/model/create', verification(1), auth.postVehiclesModel);

// patch vehicle model (*ADMIN)
route.patch('/vehicle/model/patch', verification(1), auth.patchVehiclesModel);

// delete vehicle model (*ADMIN)
route.delete('/vehicle/model/delete', verification(1), auth.deleteVehiclesModel);

//------------------------------------------------------------------------------------YEAR
// get vehicle year
route.get('/vehicle/year', verification(), auth.getVehiclesYear);

// get vehicle year by id
route.get('/vehicle/year/:id', verification(), auth.getVehiclesYearByID);

// create vehicle year (*ADMIN)
route.post('/vehicle/year/create', verification(1), auth.postVehiclesYear);

// patch vehicle year (*ADMIN)
route.patch('/vehicle/year/patch', verification(1), auth.patchVehiclesYear);

// delete vehicle year (*ADMIN)
route.delete('/vehicle/year/delete', verification(1), auth.deleteVehiclesYear);

//------------------------------------------------------------------------------------PRICELIST
// get vehicle pricelist
route.get('/vehicle/pricelist', verification(), auth.getPricelist);

// get vehicle brand id
route.get('/vehicle/pricelist/:year', verification(), auth.getPricelistSameYear);

// create vehicle pricelist (*ADMIN)
route.post('/vehicle/pricelist/create', verification(1), auth.postPricelist);

// patch vehicle pricelist (*ADMIN)
route.patch('/vehicle/pricelist/patch', verification(1), auth.patchPricelist);

// delete vehicle brand (*ADMIN)
route.delete('/vehicle/pricelist/delete', verification(1), auth.deletePricelist);

module.exports = route;