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
                if (err) { // if token expired, delete it
                    connection.query("DELETE FROM access_token WHERE token=?", [token], (err, rows) => {
                        return response.bad('Unexpected Token.', res);
                    });
                } else {
                    if (need_admin == 1){ // if need admin to get, post, patch, delete data
                        connection.query("SELECT users.is_admin, token FROM access_token JOIN users WHERE access_token.user_id = users.id AND token=?", [token], (err, rows) => {
                            if (rows[0].is_admin == 1){
                                req.auth = decoded;
                                next();
                            } else {
                                return response.bad('Unauthorized User as Admin, Try Again.', res);
                            }
                        });
                    } else { // else the routes does not need admin
                        req.auth = decoded;
                        next();
                    }
                }
            })
        } else {
            return response.bad('Token Not Available.', res);
        }
    }
}

module.exports = verification;