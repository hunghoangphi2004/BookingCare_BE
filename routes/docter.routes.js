// routes/doctor.routes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/admin/uploadCloud.middleware");

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Quản lý bác sĩ
 */

/**
 * @swagger
 * /doctor/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.get("/get-all", auth, doctorController.getAllDoctor);

/**
 * @swagger
 * /doctor/create:
 *   post:
 *     summary: Tạo mới bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               specializationId:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               experience:
 *                 type: number
 *               consultationFee:
 *                 type: number
 *               name:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
router.post(
  "/create",
  auth,
  role("admin"),
  upload.single("thumbnail"),
  doctorController.createDoctor
);

/**
 * @swagger
 * /doctor/edit/{id}:
 *   put:
 *     summary: Cập nhật thông tin bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của bác sĩ
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               experience:
 *                 type: number
 *               consultationFee:
 *                 type: number
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */
router.put(
  "/edit/:id",
  auth,
  role("admin", "doctor"),
  doctorController.editDoctor
);

/**
 * @swagger
 * /doctor/delete/{id}:
 *   delete:
 *     summary: Xóa bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của bác sĩ
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */
router.delete(
  "/delete/:id",
  auth,
  role("admin"),
  doctorController.deleteDoctor
);

/**
 * @swagger
 * /doctor/change-status/{status}/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái bác sĩ
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         description: Trạng thái mới (true/false)
 *         required: true
 *         schema:
 *           type: boolean
 *       - name: id
 *         in: path
 *         description: ID của bác sĩ
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */
router.patch(
  "/change-status/:status/:id",
  auth,
  role("admin"),
  doctorController.changeStatus
);

module.exports = router;
