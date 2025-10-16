/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: API quản lý bác sĩ
 */

/**
 * @swagger
 * /doctors/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả bác sĩ (phân trang + lọc)
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: specializationId
 *         schema:
 *           type: string
 *         description: Lọc theo chuyên khoa
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *         description: Lọc theo phòng khám
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Lọc theo trạng thái bác sĩ
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên bác sĩ
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách bác sĩ
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/create:
 *   post:
 *     summary: Tạo mới bác sĩ (chỉ admin)
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *               - specializationId
 *             properties:
 *               email:
 *                 type: string
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: Bác sĩ Nguyễn Văn A
 *               licenceNumber:
 *                 type: string
 *                 example: D12345
 *               phoneNumber:
 *                 type: string
 *                 example: "0987654321"
 *               experience:
 *                 type: number
 *                 example: 5
 *               consultationFee:
 *                 type: number
 *                 example: 200000
 *               clinicId:
 *                 type: string
 *               specializationId:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo bác sĩ thành công
 *       400:
 *         description: Thiếu dữ liệu
 *       409:
 *         description: Email đã tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/edit/{id}:
 *   put:
 *     summary: Chỉnh sửa thông tin bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bác sĩ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               licenceNumber:
 *                 type: string
 *               experience:
 *                 type: number
 *               consultationFee:
 *                 type: number
 *               clinicId:
 *                 type: string
 *               specializationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền chỉnh sửa
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/delete/{id}:
 *   delete:
 *     summary: Xóa bác sĩ (chỉ admin)
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bác sĩ cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/change-status/{status}/{id}:
 *   patch:
 *     summary: Đổi trạng thái bác sĩ (active/inactive)
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đổi trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/{slug}:
 *   get:
 *     summary: Lấy thông tin bác sĩ theo slug
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của bác sĩ
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin bác sĩ
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /doctors/getDoctorById/{id}:
 *   get:
 *     summary: Lấy thông tin bác sĩ theo ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin bác sĩ
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */
