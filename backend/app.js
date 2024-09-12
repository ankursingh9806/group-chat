require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");
const homeRoute = require("./routes/homeRoute");
const messageRoute = require("./routes/messageRoute");
const groupRoute = require("./routes/groupRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");

const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroupModel");
const ArchiveChat = require("./models/archiveChatModel");
const ResetPassword = require("./models/resetPasswordModel");

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

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/user", userRoute);
app.use("/home", homeRoute);
app.use("/message", messageRoute);
app.use("/group", groupRoute);
app.use("/password", resetPasswordRoute);

// undefined route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
});

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

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

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

require("./utils/cron");