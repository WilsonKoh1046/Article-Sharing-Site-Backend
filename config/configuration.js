require("dotenv").config();

// DB
const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.PORT;

// JWT
const secretKey = process.env.JWTSECRET;
const expiresIn = process.env.JWTEXPIRES;

// Bcrypt
const saltRound = parseInt(process.env.SALTROUND);

module.exports = {
    user,
    host,
    database,
    password,
    port,
    secretKey,
    expiresIn,
    saltRound
}