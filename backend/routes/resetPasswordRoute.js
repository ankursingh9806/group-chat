const express = require("express");
const router = express.Router();

const resetPasswordController = require("../controllers/resetPasswordController");

router.get("/forgot-password-page", resetPasswordController.forgotPasswordPage);
router.post("/forgot-password", resetPasswordController.forgotPassword);
router.get("/reset-password-page/:resetId", resetPasswordController.resetPasswordPage);
router.post("/reset-password/:resetId", resetPasswordController.resetPassword);

module.exports = router;