/**
 * @swagger
 * tags:
 *   name: Supporter
 *   description: API quản lý nhân viên hỗ trợ (Supporter)
 */

/**
 * @swagger
 * /supporter/create:
 *   post:
 *     summary: Tạo mới một nhân viên Supporter
 *     tags: [Supporter]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       API cho phép **Admin** tạo một tài khoản nhân viên hỗ trợ (Supporter).
 *       Bao gồm việc upload ảnh đại diện lên Cloudinary và tạo tài khoản User tương ứng trong hệ thống.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "supporter01@example.com"
 *                 description: Email đăng nhập của supporter
 *               password:
 *                 type: string
 *                 example: "12345678"
 *                 description: Mật khẩu cho tài khoản supporter
 *               name:
 *                 type: string
 *                 example: "Nguyễn Thị Hỗ Trợ"
 *                 description: Tên đầy đủ của supporter
 *               phoneNumber:
 *                 type: string
 *                 example: "0901234567"
 *                 description: Số điện thoại của supporter
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện của supporter (upload qua Cloudinary)
 *     responses:
 *       201:
 *         description: Tạo supporter thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Supporter created successfully"
 *               user:
 *                 _id: "6711a2b33fd456aaf24e5678"
 *                 email: "supporter01@example.com"
 *                 role: "supporter"
 *               doctor:
 *                 _id: "6711a3b93fd456aaf24e9876"
 *                 name: "Nguyễn Thị Hỗ Trợ"
 *                 phoneNumber: "0901234567"
 *                 thumbnail: "https://res.cloudinary.com/demo/image/upload/v1234567/supporters/abcxyz.jpg"
 *       400:
 *         description: Thiếu dữ liệu bắt buộc hoặc không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email là bắt buộc"
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Email đã tồn tại"
 *       403:
 *         description: Không có quyền tạo supporter
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Forbidden: Không có quyền"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
