const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroupModel");
const sequelize = require("../utils/database");

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
    const t = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const group = await Group.create({
            name: groupName,
            admin: req.user.id,
        }, { transaction: t });
        await UserGroup.create({
            UserId: req.user.id,
            groupId: group.id,
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "group created", group: group });
    } catch (error) {
        await t.rollback();
        console.error("error:", error);
        res.status(500).json({ error: "failed to create group" });
    }
};

const deleteGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { groupId } = req.params;
        const group = await Group.findByPk(groupId, { transaction: t });
        if (group.admin !== req.user.id) {
            await t.rollback();
            return res.status(403).json({ error: "only admin can delete this group" });
        }
        await group.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({ message: "group deleted" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const addToGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, groupId } = req.body;
        const group = await Group.findByPk(groupId, { transaction: t });
        const user = await User.findOne({ where: { email: email }, transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { UserId: user.id, groupId: groupId }, transaction: t });
        if (userGroup) {
            await t.rollback();
            return res.status(400).json({ error: "user is already in the group" });
        }
        await UserGroup.create({
            UserId: user.id,
            groupId: groupId
        }, { transaction: t });
        await t.commit();
        res.status(200).json({ message: "user added to group" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const removeFromGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, groupId } = req.body;
        const user = await User.findOne({ where: { email: email }, transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { UserId: user.id, groupId: groupId }, transaction: t });
        if (!userGroup) {
            await t.rollback();
            return res.status(400).json({ error: "user is not in the group" });
        }
        await userGroup.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({ message: "user removed from group" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const getGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findByPk(groupId);
        const members = await UserGroup.findAll({
            where: { groupId: groupId },
            include: [{ model: User, attributes: ["id", "name", "email"] }]
        });
        if (!members.length) {
            return res.status(404).json({ error: "no members found for this group" });
        }
        const users = members.map(member => {
            const user = member.User;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.id === group.admin
            };
        });
        res.status(200).json({ users: users });
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
    getGroupMembers
};