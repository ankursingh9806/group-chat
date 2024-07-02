const Message = require("../models/messageModel");
const Group = require("../models/groupModel");

const sendMessage = async (req, res) => {
    try {
        const { message, groupId } = req.body;
        const newMessage = await Message.create({
            name: req.user.name,
            message: message,
            UserId: req.user.id,
            groupId: groupId
        });
        res.status(201).json({ message: "message sent", data: newMessage });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const getMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await Message.findAll({
            where: { groupId: groupId },
        });
        res.status(200).json({ message: "message received", data: messages });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessage,
};