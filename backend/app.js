require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");
const groupRoute = require("./routes/groupRoute");
const messageRoute = require("./routes/messageRoute");

const User = require("./models/userModel");
const ResetPassword = require("./models/resetPasswordModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroupModel");
const Message = require("./models/messageModel");

// using socket
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { file: "a" })
app.use(morgan("combined", { stream: accessLogStream }));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdn.socket.io"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        }
    }
}));

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/user", userRoute);
app.use("/password", resetPasswordRoute);
app.use("/group", groupRoute);
app.use("/message", messageRoute);

// create an http server
const server = createServer(app);

// initialize socket.io with cors settings
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

// socke.io events
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("receiveMessage", (data) => {
        // console.log(data);
        io.emit("sendMessage", data);
        // console.log(data);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

User.belongsToMany(Group, { through: UserGroup, foreignKey: "userId" });
Group.belongsToMany(User, { through: UserGroup, foreignKey: "groupId" });

UserGroup.belongsTo(User, { foreignKey: "userId" });
UserGroup.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

Group.hasMany(Message, { foreignKey: "groupId" });
Message.belongsTo(Group, { foreignKey: "groupId" });

User.hasMany(ResetPassword, { foreignKey: "userId" });
ResetPassword.belongsTo(User, { foreignKey: "userId" });

sequelize
    //.sync({ force: true })
    .sync()
    .then(() => {
        // app.listen(3000, () => {
        server.listen(3000, () => {
            console.log("Node.js application is connected to MySQL");
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("Error connecting to MySQL:", err);
    });

require("./utils/cron.js");