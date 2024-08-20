const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ message: "token is missing" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const foundUser = await User.findByPk(decoded.userId);
        if (!foundUser) {
            return res.status(401).json({ message: "user not found" });
        }
        req.user = foundUser;
        next();
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

module.exports = {
    authenticate
}