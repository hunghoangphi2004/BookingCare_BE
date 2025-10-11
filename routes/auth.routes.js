// routes/patient-auth.js
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware'); 
const upload = require('../middlewares/admin/uploadCloud.middleware')

const router = express.Router();
router.get('/get-all-users',auth, AuthController.getAllUsers)
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/send-forget-password-otp', AuthController.sendForgetPasswordOTP)
router.post('/change-password', AuthController.changePassword)
router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout",auth, AuthController.logout);

router.get("/profile", auth, AuthController.getProfile);

router.post(
  "/change-avatar",
  auth,
  upload.single("avatar"),
  AuthController.changeAvatar
);



module.exports = router;