const jwt = require('jsonwebtoken');
const response = require('../res');
const config = require('../config/secret');
const connection = require('../connection');

function verification(need_admin){
    return function(req, res, next){
        var tokenWithBearer = req.headers.authorization;
        if (tokenWithBearer){
            var token = tokenWithBearer.split(' ')[1];
            jwt.verify(token, config.secret, function(err, decoded) {
                //Hapus token yang sudah invalid
                if (err) {
                    connection.query("DELETE FROM access_token WHERE token=?", [token], (err, rows) => {
                        return response.bad('Token tidak tersedia', res);
                    });
                } else {
                    //Validasi apakah 1 (admin) atau bukan
                    if (need_admin == 1){
                        connection.query("SELECT users.is_admin, token FROM access_token JOIN users WHERE access_token.user_id = users.id AND token=?", [token], (err, rows) => {
                            if (rows[0].is_admin == 1){
                                req.auth = decoded;
                                next();
                            } else {
                                return response.bad('Halaman ini hanya dapat diakses oleh Admin.', res);
                            }
                        });
                    } else {
                        req.auth = decoded;
                        next();
                    }
                }
            })
        } else {
            return response.bad('Masukan Token Verifikasi!', res);
        }
    }
}

module.exports = verification;