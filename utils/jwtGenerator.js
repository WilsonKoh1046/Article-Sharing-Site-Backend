const JWT = require("jsonwebtoken");
const { expiresIn, secretKey } = require("../config/configuration");

module.exports = (user_email) => {
    let claims = {
        email: user_email
    }

    let option = {
        expiresIn: expiresIn
    }
    return new Promise((resolve, reject) => {
        try {
            let token = JWT.sign(claims, secretKey, option);
            resolve(token);
        } catch(err) {
            reject(err);
        }
    })
}
