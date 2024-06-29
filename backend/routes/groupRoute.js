const express = require("express");
const router = express.Router();

const groupController = require("../controllers/groupController");
const authentication = require("../middleware/authentication");

router.get("/get-groups", authentication.authenticate, groupController.getGroups);
router.post("/create-group", authentication.authenticate, groupController.createGroup);

module.exports = router;