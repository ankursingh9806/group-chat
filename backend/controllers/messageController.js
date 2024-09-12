const Message = require("../models/messageModel");
const sequelize = require("../utils/database");
const s3Services = require("../services/s3Services");

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

const uploadFile = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const fileName = req.file.originalname;
        const fileBuffer = req.file.buffer;
        const fileUrl = await s3Services.uploadToS3(fileBuffer, fileName);
        const newMessage = await Message.create({
            name: req.user.name,
            fileUrl: fileUrl,
            userId: req.user.id,
            groupId: req.params.groupId
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "File sent", data: newMessage });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessage,
    uploadFile
};