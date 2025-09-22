// routes/clinic.routes.js
const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinic.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/admin/uploadCloud.middleware");

/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: Quản lý phòng khám
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
 *           example: 651234abcd5678ef90123456
 *         name:
 *           type: string
 *           example: Phòng khám đa khoa ABC
 *         address:
 *           type: string
 *           example: 123 Nguyễn Trãi, Hà Nội
 *         openingHours:
 *           type: string
 *           example: 08:00 - 17:00
 *         phone:
 *           type: string
 *           example: 0123456789
 *         description:
 *           type: string
 *           example: Phòng khám uy tín với đội ngũ bác sĩ nhiều kinh nghiệm
 *         image:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/v123456/clinic.jpg
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         slug:
 *           type: string
 *           example: phong-kham-da-khoa-abc
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /clinic/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phòng khám
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinic'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (không phải admin)
 */
router.get("/get-all", auth, role("admin"), clinicController.getAllClinic);

/**
 * @swagger
 * /clinic/create:
 *   post:
 *     summary: Tạo mới phòng khám
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
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phòng khám đa khoa ABC
 *               address:
 *                 type: string
 *                 example: 123 Nguyễn Trãi, Hà Nội
 *               openingHours:
 *                 type: string
 *                 example: 08:00 - 17:00
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *               description:
 *                 type: string
 *                 example: Phòng khám uy tín với đội ngũ bác sĩ nhiều kinh nghiệm
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tạo phòng khám thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  auth,
  role("admin"),
  upload.single("image"),
  clinicController.createClinic
);

/**
 * @swagger
 * /clinic/edit/{id}:
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
 *         description: ID của phòng khám
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               openingHours:
 *                 type: string
 *               phone:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy phòng khám
 */
router.put("/edit/:id", auth, role("admin"), clinicController.editClinic);

/**
 * @swagger
 * /clinic/delete/{id}:
 *   delete:
 *     summary: Xóa phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng khám
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy phòng khám
 */
router.delete(
  "/delete/:id",
  auth,
  role("admin"),
  clinicController.deleteClinic
);

/**
 * @swagger
 * /clinic/change-status/{status}/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái hoạt động của phòng khám
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Trạng thái mới (active/inactive)
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng khám
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy phòng khám
 */
router.patch(
  "/change-status/:status/:id",
  auth,
  role("admin"),
  clinicController.changeStatus
);

module.exports = router;
