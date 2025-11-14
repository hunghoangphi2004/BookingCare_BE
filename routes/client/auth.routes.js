const express = require('express');
const authController = require('../../controllers/client/auth.controller');
const upload = require('../../middlewares/admin/uploadCloud.middleware')
const authMiddleware = require("../../middlewares/client/auth.middleware.js")

const router = express.Router();
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/send-forget-password-otp', authController.sendForgetPasswordOTP)
router.post('/change-password', authController.changePassword)
router.post("/refresh-token", authController.refreshToken);
router.post('/send-register-otp', authController.sendRegisterOTP)
router.get("/logout", authController.logout);
router.get("/profile", authMiddleware.requireAuth, authController.getProfile);

router.post(
  "/change-avatar",
  upload.single("avatar"),
  authController.changeAvatar
);

module.exports = router;