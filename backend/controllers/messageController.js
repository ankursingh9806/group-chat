const Message = require("../models/messageModel");
const Group = require("../models/groupModel");
const uploadToS3 = require("../services/s3Services");

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

const uploadFile = async (req, res) => {
    try {
        const fileName = req.file.originalname;
        const fileBuffer = req.file.buffer;
        const fileUrl = await uploadToS3.uploadToS3(fileBuffer, fileName);
        const newMessage = await Message.create({
            name: req.user.name,
            fileUrl: fileUrl,
            UserId: req.user.id,
            groupId: req.params.groupId
        });
        res.status(201).json({ message: "file sent", data: newMessage });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessage,
    uploadFile
};