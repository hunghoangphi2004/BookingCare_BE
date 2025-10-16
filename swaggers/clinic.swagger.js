/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: API quản lý phòng khám (Admin)
 */

/**
 * @swagger
 * /clinics/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: false
 *         description: Từ khóa tìm kiếm theo tên phòng khám
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Trả về danh sách phòng khám và thông tin phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Clinic'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 35
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *       401:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /clinics/create:
 *   post:
 *     summary: Tạo phòng khám mới
 *     tags: [Clinic]
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
 *               - address
 *               - openingHours
 *               - phone
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phòng khám Đa khoa Hòa Hảo"
 *               address:
 *                 type: string
 *                 example: "254 Hòa Hảo, Quận 10, TP.HCM"
 *               openingHours:
 *                 type: string
 *                 example: "7:00 - 17:00"
 *               phone:
 *                 type: string
 *                 example: "02838512345"
 *               description:
 *                 type: string
 *                 example: "Phòng khám uy tín chuyên khoa nội tổng quát"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo phòng khám thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 */

/**
 * @swagger
 * /clinics/edit/{id}:
 *   put:
 *     summary: Chỉnh sửa thông tin phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng khám cần chỉnh sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phòng khám Hòa Hảo - Cơ sở 2"
 *               address:
 *                 type: string
 *                 example: "12 Nguyễn Huệ, Quận 1"
 *               openingHours:
 *                 type: string
 *                 example: "8:00 - 18:00"
 *               phone:
 *                 type: string
 *                 example: "02838515555"
 *               description:
 *                 type: string
 *                 example: "Cập nhật thông tin cơ sở 2"
 *               image:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/clinic2.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: ID không hợp lệ hoặc dữ liệu sai
 *       404:
 *         description: Không tìm thấy phòng khám
 */

/**
 * @swagger
 * /clinics/delete/{id}:
 *   delete:
 *     summary: Xóa (ẩn) phòng khám khỏi hệ thống
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng khám cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy phòng khám
 */

/**
 * @swagger
 * /clinics/change-status/{status}/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái hoạt động của phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         description: Trạng thái mới ("active" hoặc "inactive")
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID phòng khám cần thay đổi trạng thái
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái hoặc ID không hợp lệ
 *       404:
 *         description: Không tìm thấy phòng khám
 */

/**
 * @swagger
 * /clinics/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết phòng khám theo slug
 *     tags: [Clinic]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug của phòng khám
 *         schema:
 *           type: string
 *           example: "phong-kham-da-khoa-hoa-hao"
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết phòng khám
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       404:
 *         description: Không tìm thấy phòng khám
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Clinic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6710da0ca23b8f0001e7d412"
 *         name:
 *           type: string
 *           example: "Phòng khám Đa khoa Hòa Hảo"
 *         address:
 *           type: string
 *           example: "254 Hòa Hảo, Quận 10, TP.HCM"
 *         openingHours:
 *           type: string
 *           example: "7:00 - 17:00"
 *         phone:
 *           type: string
 *           example: "02838512345"
 *         description:
 *           type: string
 *           example: "Phòng khám uy tín, phục vụ tận tâm"
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/demo/image/upload/clinic.jpg"
 *         isActive:
 *           type: boolean
 *           example: true
 *         slug:
 *           type: string
 *           example: "phong-kham-da-khoa-hoa-hao"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
