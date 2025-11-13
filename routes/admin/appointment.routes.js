const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/admin/appointment.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', appointmentController.getAllAppointment);
router.patch('/change-status/:id/:status',  appointmentController.changeStatusAppointment);

// router.post("/create",auth, role("admin"),upload.single("image"), clinicController.createClinic);

// router.put("/edit/:id", auth, role("admin"), clinicController.editClinic);

// router.delete("/delete/:id", auth, role("admin"), clinicController.deleteClinic);

// router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

// router.get('/:slug', clinicController.getClinicBySlug);

module.exports = router;
