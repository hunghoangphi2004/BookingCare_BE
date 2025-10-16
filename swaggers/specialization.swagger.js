/**
 * @swagger
 * tags:
 *   name: Specializations
 *   description: Quản lý chuyên khoa (dành cho admin và public)
 */

/**
 * @swagger
 * /specializations/get-all:
 *   get:
 *     summary: Lấy danh sách chuyên khoa
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Giới hạn số bản ghi mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "Da liễu"
 *         description: Tìm kiếm chuyên khoa theo tên
 *     responses:
 *       200:
 *         description: Lấy danh sách chuyên khoa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Specialization'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /specializations/create:
 *   post:
 *     summary: Tạo mới chuyên khoa
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nội tổng quát"
 *               description:
 *                 type: string
 *                 example: "Khám và điều trị các bệnh nội khoa tổng quát."
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tạo chuyên khoa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 newSpecialization:
 *                   $ref: '#/components/schemas/Specialization'
 *       400:
 *         description: Thiếu thông tin hoặc dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /specializations/edit/{id}:
 *   put:
 *     summary: Chỉnh sửa chuyên khoa theo ID
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyên khoa cần chỉnh sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tim mạch"
 *               description:
 *                 type: string
 *                 example: "Khám và điều trị bệnh tim mạch."
 *               image:
 *                 type: string
 *                 example: "https://example.com/timmach.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */

/**
 * @swagger
 * /specializations/delete/{id}:
 *   delete:
 *     summary: Xóa (đánh dấu isDeleted) chuyên khoa
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyên khoa
 *     responses:
 *       200:
 *         description: Xóa chuyên khoa thành công
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */

/**
 * @swagger
 * /specializations/{slug}:
 *   get:
 *     summary: Lấy thông tin chuyên khoa theo slug
 *     tags: [Specializations]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "noi-tong-quat"
 *         description: Slug của chuyên khoa
 *     responses:
 *       200:
 *         description: Trả về thông tin chuyên khoa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Specialization'
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "670f12a8e8b7a31eac8de9d3"
 *         name:
 *           type: string
 *           example: "Nội tổng quát"
 *         slug:
 *           type: string
 *           example: "noi-tong-quat"
 *         description:
 *           type: string
 *           example: "Khám và điều trị các bệnh lý nội khoa."
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/example/image/upload/v123456789/specializations/noi-tong-quat.jpg"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
