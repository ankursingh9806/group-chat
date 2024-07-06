const cron = require("node-cron");
const { Op } = require("sequelize");
const Message = require("../models/messageModel");
const ArchiveChat = require("../models/archiveChatModel");

cron.schedule("0 0 * * *", async () => {
    try {
        const messagesToArchive = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });
        for (let message of messagesToArchive) {
            await ArchiveChat.create({
                name: message.name,
                message: message.message,
                fileUrl: message.fileUrl,
                UserId: message.UserId,
                groupId: message.groupId,
            });
            await message.destroy();
        }
        console.log("archiving completed");
    } catch (error) {
        console.error("error:", error);
    }
});