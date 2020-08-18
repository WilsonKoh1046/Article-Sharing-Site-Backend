const bcrypt = require("bcrypt");
const config = require("../config/configuration");

module.exports = async (password) => {
    try {
        let salt = await bcrypt.genSalt(config.saltRound);
        let hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    } catch(err) {
        console.log(err);
    }
}