// routes/auth.js
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *               - profile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *               role:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: doctor
 *                 description: Vai trò của người dùng
 *               profile:
 *                 type: object
 *                 description: Thông tin profile (khác nhau theo role)
 *                 oneOf:
 *                   - title: Doctor Profile
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: John
 *                         description: Tên
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                         description: Họ
 *                       specialization:
 *                         type: string
 *                         example: Cardiology
 *                         description: Chuyên khoa
 *                       licenseNumber:
 *                         type: string
 *                         example: MD123456
 *                         description: Số giấy phép hành nghề
 *                       phoneNumber:
 *                         type: string
 *                         example: "0123456789"
 *                         description: Số điện thoại
 *                   - title: Patient Profile
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: Jane
 *                         description: Tên
 *                       lastName:
 *                         type: string
 *                         example: Smith
 *                         description: Họ
 *                       phoneNumber:
 *                         type: string
 *                         example: "0987654321"
 *                         description: Số điện thoại
 *                       dateOfBirth:
 *                         type: string
 *                         format: date
 *                         example: "1990-01-15"
 *                         description: Ngày sinh
 *           examples:
 *             doctor:
 *               summary: Đăng ký bác sĩ
 *               value:
 *                 email: "doctor@example.com"
 *                 password: "123456"
 *                 role: "doctor"
 *                 profile:
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   specialization: "Cardiology"
 *                   licenseNumber: "MD123456"
 *                   phoneNumber: "0123456789"
 *             patient:
 *               summary: Đăng ký bệnh nhân
 *               value:
 *                 email: "patient@example.com"
 *                 password: "123456"
 *                 role: "patient"
 *                 profile:
 *                   firstName: "Jane"
 *                   lastName: "Smith"
 *                   phoneNumber: "0987654321"
 *                   dateOfBirth: "1990-01-15"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "64f5a9b8c1234567890abcde"
 *                         email:
 *                           type: string
 *                           example: "doctor@example.com"
 *                         role:
 *                           type: string
 *                           example: "doctor"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         profile:
 *                           type: object
 *                           description: Profile information based on role
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT access token
 *       400:
 *         description: Lỗi validate hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 *                 error:
 *                   type: string
 *                   example: "This email is already registered. Please use a different email or try logging in."
 *             examples:
 *               email_exists:
 *                 summary: Email đã tồn tại
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *                   error: "This email is already registered. Please use a different email or try logging in."
 *               missing_fields:
 *                 summary: Thiếu trường bắt buộc
 *                 value:
 *                   success: false
 *                   message: "Missing required fields"
 *                   error: "Email, password and role are required"
 *               invalid_email:
 *                 summary: Email không hợp lệ
 *                 value:
 *                   success: false
 *                   message: "Invalid email format"
 *                   error: "Please provide valid email"
 *               weak_password:
 *                 summary: Mật khẩu quá ngắn
 *                 value:
 *                   success: false
 *                   message: "Password too short"
 *                   error: "Password must be at least 6 characters"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.post('/register', AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "doctor@example.com"
 *                 description: Email đăng nhập
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: Mật khẩu
 *           examples:
 *             doctor_login:
 *               summary: Đăng nhập bác sĩ
 *               value:
 *                 email: "doctor@example.com"
 *                 password: "123456"
 *             patient_login:
 *               summary: Đăng nhập bệnh nhân
 *               value:
 *                 email: "patient@example.com"
 *                 password: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         profile:
 *                           type: object
 *                           description: Profile information
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     expiresIn:
 *                       type: string
 *                       example: "24h"
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing credentials"
 *                 error:
 *                   type: string
 *                   example: "Email and password are required"
 *       401:
 *         description: Sai email hoặc mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 */
router.post('/login', AuthController.login);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Lấy thông tin profile người dùng
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User information with profile
 *       401:
 *         description: Không có quyền truy cập
 */
// Protected routes
router.get('/profile', auth, AuthController.getProfile);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi thiết bị hiện tại
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */
router.post('/logout', auth, AuthController.logout);

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     summary: Đăng xuất khỏi tất cả thiết bị
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất khỏi tất cả thiết bị thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out from all devices successfully"
 */
router.post('/logout-all', auth, AuthController.logoutAll);

// Role-based routes examples
// router.get('/doctors-only', auth, authorizeRoles('doctor'), (req, res) => {
//     res.json({ message: 'Welcome doctor!' });
// });

/**
 * @openapi
 * /auth/admin-only:
 *   get:
 *     summary: Route chỉ dành cho admin (demo)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chào mừng admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome admin!"
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/admin-only', auth, authorizeRoles('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome admin!' 
    });
});

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;