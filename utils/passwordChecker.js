const bcrypt = require("bcrypt");

module.exports = async (plain_text_password, hashed_password) => {
    try {
        return await bcrypt.compare(plain_text_password, hashed_password);
    } catch(err) {
        console.log(err);
    }
}