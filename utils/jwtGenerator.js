const JWT = require("jsonwebtoken");
const config = require("../config/configuration");

module.exports = (user_email) => {
    let claims = {
        email: user_email
    }

    let option = {
        expiresIn: config.expiresIn
    }
    return new Promise((resolve, reject) => {
        try {
            let token = JWT.sign(claims, config.secretKey, option);
            resolve(token);
        } catch(err) {
            reject(err);
        }
    })
}
