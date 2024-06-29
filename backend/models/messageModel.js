const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Message = sequelize.define("Message", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    message: {
        type: Sequelize.STRING,
    },
});

module.exports = Message;