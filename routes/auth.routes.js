// routes/auth.js
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);
router.post('/logout', auth, AuthController.logout);
router.post('/logout-all', auth, AuthController.logoutAll);

// Role-based routes examples
// router.get('/doctors-only', auth, authorizeRoles('doctor'), (req, res) => {
//     res.json({ message: 'Welcome doctor!' });
// });

router.get('/admin-only', auth, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome admin!' });
});

module.exports = router;