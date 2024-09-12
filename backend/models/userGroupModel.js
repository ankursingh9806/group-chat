const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const UserGroup = sequelize.define("UserGroup", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "member",
    }
});

module.exports = UserGroup;