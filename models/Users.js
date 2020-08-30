const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const { Posts } = require("./Posts");

class Users extends Model {};

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "users",
    timestamps: false // To remove default 'createAT' column (which will cause error if not exists in DB)
});

Users.hasMany(Posts, {
    foreignKey: "user_id"
});

/*
(async () => {
    try {
        await sequelize.sync();
    } catch(err) {
        console.log(err);
    }
})(); */

module.exports = Users;
