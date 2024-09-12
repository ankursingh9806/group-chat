const Message = require("../models/messageModel");
const sequelize = require("../utils/database");

const sendMessage = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { message, groupId } = req.body;
        const newMessage = await Message.create({
            name: req.user.name,
            message: message,
            userId: req.user.id,
            groupId: groupId
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ newMessage, message: "message send" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await Message.findAll({
            where: { groupId: groupId },
        });
        res.status(200).json({ message: "messages received", data: messages });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessage,
};