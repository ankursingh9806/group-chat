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
        const group = await Group.create({
            name: groupName,
            admin: req.user.id,
        });
        await UserGroup.create({
            UserId: req.user.id,
            groupId: group.id,
        });
        res.status(201).json({ message: "group created", group: group });
    } catch (error) {
        console.error("error:", error);
        res.status(500).json({ error: "failed to create group" });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findByPk(groupId);
        if (group.admin !== req.user.id) {
            return res.status(403).json({ error: "only admin can delete this group" });
        }
        await group.destroy();
        res.status(200).json({ message: "group deleted" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const addToGroup = async (req, res) => {
    try {
        const { email, groupId } = req.body;
        const group = await Group.findByPk(groupId);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { UserId: user.id, groupId: groupId } });
        if (userGroup) {
            return res.status(400).json({ error: "user is already in the group" });
        }
        await UserGroup.create({
            UserId: user.id,
            groupId: groupId
        });
        res.status(200).json({ message: "user added to group" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const removeFromGroup = async (req, res) => {
    try {
        const { email, groupId } = req.body;
        const group = await Group.findByPk(groupId);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { UserId: user.id, groupId: groupId } });
        if (!userGroup) {
            return res.status(400).json({ error: "user is not in the group" });
        }
        await userGroup.destroy();
        res.status(200).json({ message: "user removed from group" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    getGroups,
    createGroup,
    deleteGroup,
    addToGroup,
    removeFromGroup,
}