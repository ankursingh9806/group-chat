const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const authentication = require("../middleware/authentication");

router.get("/home-page", authentication.authenticate, homeController.homePage);

module.exports = router;