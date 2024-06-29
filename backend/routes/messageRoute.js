const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const authentication = require("../middleware/authentication");

router.post("/send-message", authentication.authenticate, messageController.sendMessage);
router.get("/get-message/:groupId", authentication.authenticate, messageController.getMessage);

module.exports = router;