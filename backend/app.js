require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));

app.use("/user", userRoute);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
})

sequelize
    //.sync({ force: true })
    .sync()
    .then((result) => {
        app.listen(3000);
        console.log("server is synced with database");
    })
    .catch((err) => {
        console.error("server is unable to unable to sync with database:", err);
    });