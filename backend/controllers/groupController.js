const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroupModel");
const sequelize = require("../utils/database");

const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json({ message: "group fetched", groups });
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
            isAdmin: true,
        }, { transaction: t });

        await UserGroup.create({
            userId: req.user.id,
            groupId: group.id,
        }, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "group created", group });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const deleteGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { groupId } = req.params;
        const userId = req.user.id;
        const group = await Group.findByPk(groupId, { transaction: t });
        if (group.admin !== userId) {
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

const addPeopleToGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, groupId } = req.body;
        const user = await User.findOne({ where: { email: email }, transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { userId: user.id, groupId: groupId }, transaction: t });
        if (userGroup) {
            await t.rollback();
            return res.status(400).json({ error: "user is already in group" });
        }
        await UserGroup.create({
            userId: user.id,
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

const removePeopleFromGroup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { email, groupId } = req.body;
        const user = await User.findOne({ where: { email }, transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "user not found" });
        }
        const userGroup = await UserGroup.findOne({ where: { userId: user.id, groupId }, transaction: t });
        if (!userGroup) {
            await t.rollback();
            return res.status(400).json({ error: "user is not in group" });
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
        if (!group) {
            return res.status(404).json({ error: "group not found" });
        }
        const members = await UserGroup.findAll({
            where: { groupId },
            include: [{
                model: User,
                attributes: ["id", "name", "email"],
            }]
        });
        const users = members.map(member => ({
            id: member.User.id,
            name: member.User.name,
            email: member.User.email,
            isAdmin: member.User.id === group.admin
        }));
        res.status(200).json({ users });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    getGroups,
    createGroup,
    deleteGroup,
    addPeopleToGroup,
    removePeopleFromGroup,
    getGroupMembers,
};