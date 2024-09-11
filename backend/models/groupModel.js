const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Group = sequelize.define("Group", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = Group;