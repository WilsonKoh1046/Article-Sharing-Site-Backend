const pool = require("../config/database");
const jwtGenerator = require("../utils/jwtGenerator");   
const passwordHasher = require("../utils/passwordHasher");
const passwordChecker = require("../utils/passwordChecker");

class Users {
    constructor() {
        this._DB = pool;
        this._jwtGenerator = jwtGenerator;
        this._passwordHasher = passwordHasher;
        this._passwordChecker = passwordChecker;
    }

    async createUser(name, password, email) {
        try {
            let check = await this._DB.query(`select name from users where email = '${email}'`);
            if (check.rows.length > 0) {
                return {"Status": 401, "Message": "User already exists"};
            }
    
            let hashedPassword = await this._passwordHasher(password);
    
            let user = await this._DB.query(
                `insert into users (name, password, email) 
                values ('${name}', '${hashedPassword}', '${email}')
                returning *`
                );
            return {"Status": 201, "Message": user.rows[0]};
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveUsers() {
        try {
            let users = await this._DB.query(
                `select * from users`
                );
            return users.rows;
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveOneUser(email) {
        try {
            let user = await this._DB.query(
                `select id, name, email from users 
                where email = '${email}'`
                );
            return user.rows[0];
        } catch(err) {
            console.log(err);
        }
    }

    async updateUser(id, name, password, email) {
        try {
            let hashedPassword = await this._passwordHasher(password);
            let user = await this._DB.query(
                `update users 
                set name = '${name}', password = '${hashedPassword}', email = '${email}'
                where id = ${id}
                returning *`
                );
            return user.rows[0];
        } catch(err) {
            console.log(err);
        }
    }

    async deleteUser(id, email) {
        try {
            let user = await this._DB.query(
                `delete from users 
                where id = ${id} and email = '${email}'
                returning *`
                );
            return user.rows[0];
        } catch(err) {
            console.log(err);
        }
    }

    async signInUser(password, email) {
        try {
            let user = await this._DB.query(
                `select * from users where email = '${email}'`
                );
            if (user.rows.length === 0) {
                return {"Status": 401, "Message": "User not found"};
            }
    
            const decodedPassword = await this._passwordChecker(password, user.rows[0].password);
    
            if (!decodedPassword) {
                return {"Status": 401, "Message": "Invalid Password"};
            }
            
            const token = await this._jwtGenerator(user.rows[0].email);
            return {"Status": 201, "Token": token};
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Users();