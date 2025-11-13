// routes/patient-auth.js
const express = require('express');
const authController = require('../../controllers/admin/auth.controller');
const router = express.Router();
const authMiddleware = require("../../middlewares/admin/auth.middleware.js")

router.post('/login', authController.login)
router.get('/logout', authController.logout )
router.get('/get-profile',authMiddleware.requireAuth, authController.getProfile )

module.exports = router;