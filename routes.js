'use strict'

module.exports = function(app){
    var jsonku = require('./controller');

    app.route('/')
        .get(jsonku.index);
    
    //Menampilkan seluruh data Kendaraan dalam Group Nested
    app.route('/alldatavehicle')
        .get(jsonku.ambilDataKendaraan);
}