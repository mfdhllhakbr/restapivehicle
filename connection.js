var mysql = require('mysql');

// Koneksi Database
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db_vehicle'
});

conn.connect( (err) => {
    if (err) throw err;
    console.log("Koneksi Database Sukses");
})

module.exports = conn;