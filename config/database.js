const { Sequelize } =  require("sequelize");
const {
  database,
  user,
  password,
  host
} = require("./configuration");

module.exports = new Sequelize(database, user, password, {
  host: host,
  dialect: "postgres"
})
