// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const supporterController = require('../../controllers/admin/supporter.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', supporterController.getAllSupporter);

router.post("/create",upload.single("thumbnail") ,supporterController.createSupporter);

router.get('/get-supporter-by-id/:id',supporterController.getSupporterById);

router.patch("/edit/:id",upload.single("thumbnail") ,supporterController.editSupporter);

router.delete("/delete/:id" ,supporterController.deleteSupporter);

router.patch("/change-status/:status/:id", supporterController.changeStatus);

// router.put("/edit/:id", auth, role("admin", "doctor"), doctorController.editDoctor);

// router.delete("/delete/:id", auth, role("admin"), doctorController.deleteDoctor);

// router.patch("/change-status/:status/:id", auth, role("admin"), doctorController.changeStatus);

// router.get('/:slug',  doctorController.getDoctorBySlug);

module.exports = router;
