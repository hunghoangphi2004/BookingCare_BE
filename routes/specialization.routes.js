const express = require("express");
const router = express.Router();
const specializationController = require("../controllers/specialization.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const upload = require("../middlewares/admin/uploadCloud.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialization:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           example: "650b5b2f8f2d9b001e3b9c1a"
 *         name:
 *           type: string
 *           example: "Cardiology"
 *         slug:
 *           type: string
 *           example: "cardiology"
 *         description:
 *           type: string
 *           example: "Chuyên khoa tim mạch"
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/demo/image/upload/v1234567890/specializations/cardiology.png"
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

/**
 * @swagger
 * /specialization/get-all:
 *   get:
 *     summary: Lấy danh sách chuyên khoa
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách chuyên khoa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Specialization'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/get-all",
  auth,
  role("admin"),
  specializationController.getAllSpec
);

/**
 * @swagger
 * /specialization/create:
 *   post:
 *     summary: Tạo chuyên khoa mới
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dermatology"
 *               description:
 *                 type: string
 *                 example: "Chuyên khoa da liễu"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialization'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  auth,
  role("admin"),
  upload.single("image"),
  specializationController.createSpecialization
);

/**
 * @swagger
 * /specialization/edit/{id}:
 *   put:
 *     summary: Chỉnh sửa chuyên khoa
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chuyên khoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Neurology"
 *               description:
 *                 type: string
 *                 example: "Chuyên khoa thần kinh"
 *               image:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/v1234567890/specializations/neurology.png"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialization'
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/edit/:id",
  auth,
  role("admin"),
  specializationController.editSpecialization
);

/**
 * @swagger
 * /specialization/delete/{id}:
 *   delete:
 *     summary: Xóa chuyên khoa
 *     tags: [Specialization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chuyên khoa
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/delete/:id",
  auth,
  role("admin"),
  specializationController.deleteSpecialization
);

module.exports = router;
