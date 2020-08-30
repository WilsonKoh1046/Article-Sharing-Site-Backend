const JWT = require("jsonwebtoken");
const { secretKey } = require("../config/configuration");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({"message": "Access denied"});
    }

    const verifyToken = (provided_token) => {
        return new Promise((resolve, reject) => {
            try {
                let verified = JWT.verify(provided_token, secretKey);
                resolve(verified);
            } catch(err) {
                reject(err);
            }
        })
    }

    try {
        const verified = await verifyToken(token);
        // add the decoded token to req object, to use it later if needed
        req.email = verified.email;
        next();
    } catch(err) {
        res.status(401).json({"message": "Token is not valid"});
    }
}