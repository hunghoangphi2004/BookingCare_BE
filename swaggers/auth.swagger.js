/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực người dùng và quản lý tài khoản
 */

/**
 * @swagger
 * /auth/get-all-users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       401:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Thông tin không hợp lệ
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken và refreshToken
 *       401:
 *         description: Sai thông tin đăng nhập
 */

/**
 * @swagger
 * /auth/send-forget-password-otp:
 *   post:
 *     summary: Gửi mã OTP quên mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Gửi OTP thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu (sau khi có OTP)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               otp: "123456"
 *               newPassword: "654321"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Mã OTP không hợp lệ hoặc hết hạn
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Cấp mới accessToken bằng refreshToken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1..."
 *     responses:
 *       200:
 *         description: Cấp mới accessToken thành công
 *       403:
 *         description: refreshToken không hợp lệ
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất khỏi hệ thống
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 */

/**
 * @swagger
 * /auth/change-avatar:
 *   post:
 *     summary: Cập nhật ảnh đại diện người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công
 *       400:
 *         description: File upload không hợp lệ
 */
