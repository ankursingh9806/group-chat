require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");
const homeRoute = require("./routes/homeRoute");
const messageRoute = require("./routes/messageRoute");
const groupRoute = require("./routes/groupRoute");

const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroupModel");

const app = express();
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));

app.use("/user", userRoute);
app.use("/home", homeRoute);
app.use("/message", messageRoute);
app.use("/group", groupRoute);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
})

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);
User.hasMany(UserGroup);
Group.hasMany(UserGroup);

sequelize
    //.sync({ force: true })
    .sync()
    .then((result) => {
        app.listen(3000);
        console.log("server is synced with database");
    })
    .catch((err) => {
        console.error("server is unable to sync with database:", err);
    });