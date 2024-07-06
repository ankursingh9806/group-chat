const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const authentication = require("../middleware/authentication");
const upload = require("../utils/multer");

router.post("/send-message", authentication.authenticate, messageController.sendMessage);
router.get("/get-message/:groupId", authentication.authenticate, messageController.getMessage);
router.post("/upload-file/:groupId", authentication.authenticate, upload.single("file"), messageController.uploadFile);

module.exports = router;