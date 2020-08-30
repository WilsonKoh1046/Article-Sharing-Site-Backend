const bcrypt = require("bcrypt");
const { saltRound } = require("../config/configuration");

module.exports = async (password) => {
    try {
        let salt = await bcrypt.genSalt(saltRound);
        let hashed_password = await bcrypt.hash(password, salt);
        return hashed_password;
    } catch(err) {
        console.log(err);
    }
}