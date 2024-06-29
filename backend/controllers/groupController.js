const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroupModel");

const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json({ message: "group fetched", groups: groups });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const group = await Group.create({ name: groupName });
        await UserGroup.create({
            UserId: req.user.id,
            groupId: group.id,
        });
        res.status(201).json({ message: "group created", group });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({ error: "failed to create group" });
    }
};

module.exports = {
    getGroups,
    createGroup,
}