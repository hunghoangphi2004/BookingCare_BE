/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Quản lý hồ sơ bệnh nhân
 */

/**
 * @swagger
 * /patient/profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân của bệnh nhân
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Nguyen"
 *               lastName:
 *                 type: string
 *                 example: "Van A"
 *               phoneNumber:
 *                 type: string
 *                 example: "0912345678"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1995-06-15"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               address:
 *                 type: string
 *                 example: "123 Lê Lợi, Quận 1, TP.HCM"
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Tran Thi B"
 *                   phone:
 *                     type: string
 *                     example: "0987654321"
 *                   relationship:
 *                     type: string
 *                     example: "Vợ"
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ bệnh nhân thành công
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
 *                   example: "Profile updated successfully"
 *                 result:
 *                   $ref: '#/components/schemas/PatientProfile'
 *       403:
 *         description: Không có quyền cập nhật hồ sơ
 *       404:
 *         description: Không tìm thấy hồ sơ bệnh nhân
 *       500:
 *         description: Lỗi khi cập nhật hồ sơ
 */

/**
 * @swagger
 * /patient/getPatientById/{id}:
 *   get:
 *     summary: Lấy thông tin hồ sơ bệnh nhân theo ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "6710d42e9f4c3a22ec0d42a1"
 *         description: ID của hồ sơ bệnh nhân
 *     responses:
 *       200:
 *         description: Lấy thông tin hồ sơ bệnh nhân thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PatientProfile'
 *       404:
 *         description: Không tìm thấy bệnh nhân
 *       401:
 *         description: Không được phép truy cập
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6710d42e9f4c3a22ec0d42a1"
 *         userId:
 *           type: string
 *           example: "670f12a8e8b7a31eac8de9d3"
 *         patientId:
 *           type: string
 *           example: "BN123456AB"
 *         firstName:
 *           type: string
 *           example: "Nguyen"
 *         lastName:
 *           type: string
 *           example: "Van A"
 *         phoneNumber:
 *           type: string
 *           example: "0912345678"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1995-06-15"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         address:
 *           type: string
 *           example: "123 Nguyễn Trãi, Hà Nội"
 *         emergencyContact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Tran Thi B"
 *             phone:
 *               type: string
 *               example: "0987654321"
 *             relationship:
 *               type: string
 *               example: "Vợ"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-17T08:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-17T09:00:00.000Z"
 */
