const express = require("express");
const router = express.Router();

const groupController = require("../controllers/groupController");
const authentication = require("../middleware/authentication");

router.get("/get-groups", authentication.authenticate, groupController.getGroups);
router.post("/create-group", authentication.authenticate, groupController.createGroup);
router.delete("/delete-group/:groupId", authentication.authenticate, groupController.deleteGroup);
router.post("/add-to-group", authentication.authenticate, groupController.addToGroup);
router.post("/remove-from-group", authentication.authenticate, groupController.removeFromGroup);
router.get("/get-group-members/:groupId", authentication.authenticate, groupController.getGroupMembers);

module.exports = router;