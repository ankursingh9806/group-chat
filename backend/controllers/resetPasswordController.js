const path = require("path");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
var nodemailer = require("nodemailer");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");

const forgotPasswordPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "forgotPassword.html"));
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const resetPasswordPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "resetPassword.html"));
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        const requestId = uuid.v4();
        await ResetPassword.create({
            UserId: user.id,
            id: requestId,
            active: true
        });
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            },
        });
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: "Reset your password",
            html: `
            <h1 style='color: #0d6efd; font-weight: bold;'>GroupChat</h1>
            <h2 style='font-weight: bold;'>Reset password</h2>
            <p>Please click on the link below to reset your account password:</p>
            <a href="http://3.104.119.209:3000/password/reset-password-page/${requestId}" style='color: #0d6efd; font-weight: bold;'>Reset password</a>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("email sent: " + info.response);
            }
        });
        res.status(200).json({ message: "email sent" });
    }
    catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { resetId } = req.params;
        const resetRequest = await ResetPassword.findOne({ where: { id: resetId, active: true } });
        if (!resetRequest) {
            return res.status(400).json({ error: "expired password reset request" });
        }
        const user = await User.findOne({ where: { id: resetRequest.UserId } });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.update({ password: hashedPassword }, { where: { id: user.id } });
        await ResetPassword.update({ active: false }, { where: { id: resetId } });
        res.status(200).json({ message: "password updated" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    forgotPasswordPage,
    forgotPassword,
    resetPasswordPage,
    resetPassword,
}