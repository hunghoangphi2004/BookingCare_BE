// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')

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
 *       500:
 *         description: Lỗi server
 */
router.get('/get-all', auth, doctorController.getAllDoctor);

router.post("/create",auth, role("admin"),upload.single("thumbnail") ,doctorController.createDoctor);

router.put("/edit/:id", auth, role("admin", "doctor"), doctorController.editDoctor);

router.delete("/delete/:id", auth, role("admin"), doctorController.deleteDoctor);

router.patch("/change-status/:status/:id", auth, role("admin"), doctorController.changeStatus);

router.get('/:slug',  doctorController.getDoctorBySlug);

module.exports = router;
