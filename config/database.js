const DB = require("./configuration");

const Pool = require('pg').Pool

module.exports = new Pool({
  user: DB.user,
  host: DB.host,
  database: DB.database,
  password: DB.password,
  port: DB.port
})
