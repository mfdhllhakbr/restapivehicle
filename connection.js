var mysql = require('mysql');

// dbvehicle connection
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'dbvehicle'
});

conn.connect( (err) => {
    if (err) throw err;
    console.log("Connect Success");
})

module.exports = conn;