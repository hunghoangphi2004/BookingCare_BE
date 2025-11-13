const express = require('express');
const router = express.Router();
const specializationController = require('../../controllers/admin/specialization.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')


router.get('/get-all', specializationController.getAllSpec);

router.post("/create",upload.single("image"), specializationController.createSpecialization);

router.patch("/edit/:id",upload.single("image"), specializationController.editSpecialization);

router.delete("/delete/:id", specializationController.deleteSpecialization);

router.get('/get-specialization-by-id/:id', specializationController.getSpecializationById);

// router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

module.exports = router;
