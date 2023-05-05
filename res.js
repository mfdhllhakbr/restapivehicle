'use strict';

const { response } = require("express");

// ok respond
exports.ok = function(values, res){
    var data = {
        'status' : 200,
        'values' : values
    };

     res.json(data);
     res.end();
}

// paginate respond
exports.paginate = function(values, res, page, limit){
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const result = values.slice(startIndex, endIndex);

    var data = {
        'status' : 200,
        'values' : result
    };

     res.json(data);
     res.end();
}

// response nested
exports.nested = function(values, res){
    const result = values.reduce((groupBrand, {id, brand_id, name, types}) => {
        if (!groupBrand[name]) groupBrand[name] = {id, brand_id, name, types: []};
        groupBrand[name].types.push(types);
        return groupBrand;
    }, {});

    var data = {
        'status' : 200,
        'values' : result
    };

    res.json(data);
    res.end();
}

exports.bad = function(values, res){
    var data = {
        'status' : 401,
        'values' : values
    }

    res.json(data);
    res.end();
}