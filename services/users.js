const Users = require("../models/Users");
const jwtGenerator = require("../utils/jwtGenerator");   
const passwordHasher = require("../utils/passwordHasher");
const passwordChecker = require("../utils/passwordChecker");

class UsersServices {
    constructor() {};

    async createUser(name, password, email) {
        try {
            let check = await Users.findAll({
                where: {
                    email: email
                }
            });
            if (check.length > 0) {
                return {"Status": 401, "Message": "User already exists"};
            }
    
            let hashedPassword = await passwordHasher(password);

            let user = await Users.create({
                name: name,
                password: hashedPassword,
                email: email
            })
            return {"Status": 201, "Message": user};
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveUsers() {
        try {
            let users = await Users.findAll();
            return users;
        } catch(err) {
            console.log(err);
        }
    }

    async retrieveOneUser(email) {
        try {
            let user = await Users.findOne({
                attributes: ["id", "name", "email"],
                where: {
                    email: email
                }
            })
            return user;
        } catch(err) {
            console.log(err);
        }
    }

    async updateUser(id, name, password, email) {
        try {
            let hashedPassword = await passwordHasher(password);
            await Users.update({
                name: name,
                password: hashedPassword,
                email: email
            }, {
                where: {
                    id: id
                }
            })
            return {"Message": `user with id ${id} is successfully updated`};
        } catch(err) {
            console.log(err);
        }
    }

    async deleteUser(id, email) {
        try {
            await Users.destroy({
                id: id,
                email: email
            })
            return {"Message": `user with id ${id} is successfully deleted`};
        } catch(err) {
            console.log(err);
        }
    }

    async signInUser(password, email) {
        try {
            let user = await Users.findOne({
                where: {
                    email: email
                }
            })
            if (user === null) {
                return {"Status": 401, "Message": "User not found"};
            }
    
            const decodedPassword = await passwordChecker(password, user.password);
    
            if (!decodedPassword) {
                return {"Status": 401, "Message": "Invalid Password"};
            }
            
            const token = await jwtGenerator(user.email);
            return {"Status": 201, "Token": token};
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = new UsersServices();
