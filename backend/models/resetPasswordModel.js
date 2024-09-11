const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ResetPassword = sequelize.define("ResetPassword", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN,
    },
});

module.exports = ResetPassword;