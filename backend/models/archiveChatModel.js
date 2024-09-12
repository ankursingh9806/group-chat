const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ArchiveChat = sequelize.define("ArchiveChat", {
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
        allowNull: true,
    },
    fileUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = ArchiveChat;