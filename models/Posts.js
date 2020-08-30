const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
// const Users = require("./Users");

class Posts extends Model {};

Posts.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content_genre: {
        type: DataTypes.ENUM,
        values: ['comedy', 'horror', 'romantic', 'fiction', 'thriller', 'family', 'gaming', 'lifestyle', 'knowledge'],
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    upvote: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true
    },
    downvote: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true
    }
}, {
    sequelize,
    tableName: "posts",
    timestamps: false
});

/*
Posts.belongsTo(Users, {
    foreignKey: "user_id"
});
*/

/*
(async () => {
    try {
        await sequelize.sync();
    } catch(err) {
        console.log(err);
    }
})(); */

module.exports = {
    Posts,
    sequelize
}
