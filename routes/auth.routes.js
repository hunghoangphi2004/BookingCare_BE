// routes/patient-auth.js
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /auth/get-all-users:
 *   get:
 *     summary: Lấy danh sách tất cả users
 *     tags: [PatientAuth]
 *     responses:
 *       200:
 *         description: Trả về danh sách users
 *       401:
 *         description: Unauthorized
 */
router.get('/get-all-users', AuthController.getAllUsers)

/**
 * @swagger
 * /auth/send-register-otp:
 *   post:
 *     summary: Gửi OTP để đăng ký tài khoản
 *     tags: [PatientAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *     responses:
 *       200:
 *         description: OTP gửi thành công
 *       400:
 *         description: Email không hợp lệ
 */
router.post('/send-register-otp', AuthController.sendRegisterOTP)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới bằng email + OTP
 *     tags: [PatientAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc OTP sai
 */
router.post('/register', AuthController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập bằng email và mật khẩu
 *     tags: [PatientAuth]
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
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về user + token
 *       400:
 *         description: Sai email hoặc mật khẩu
 *       401:
 *         description: Unauthorized
 */
router.post('/login', AuthController.login)

/**
 * @swagger
 * /auth/send-forget-password-otp:
 *   post:
 *     summary: Gửi OTP để reset mật khẩu
 *     tags: [PatientAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *     responses:
 *       200:
 *         description: Gửi OTP thành công (OTP sẽ được gửi qua email)
 *       400:
 *         description: Email không hợp lệ hoặc user chưa đăng ký
 *       500:
 *         description: Lỗi server khi gửi OTP
 */
router.post('/send-forget-password-otp', AuthController.sendForgetPasswordOTP)

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu bằng email + OTP
 *     tags: [PatientAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: newPassword123
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Mật khẩu đã đổi thành công
 *       400:
 *         description: OTP sai, hết hạn hoặc dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Lỗi server khi đổi mật khẩu
 */
router.post('/change-password', AuthController.changePassword)



module.exports = router;