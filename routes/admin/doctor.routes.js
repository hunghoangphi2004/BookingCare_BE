const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/admin/doctor.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')
const allowedRoles = require("../../middlewares/admin/role.middleware")

router.get('/get-all', allowedRoles("admin"), doctorController.getAllDoctor);

router.post("/create", upload.single("thumbnail"), doctorController.createDoctor);

router.patch("/edit/:id", upload.single("thumbnail"), doctorController.editDoctor);

router.delete("/delete/:id", doctorController.deleteDoctor);

router.patch("/change-status/:status/:id", doctorController.changeStatus);

router.get('/get-doctor-by-id/:id', doctorController.getDoctorById);

router.get(
    "/get-all-family-requests",
    doctorController.getFamilyRequestsForDoctor
)

router.patch('/reject-family-doctor/:familyId', doctorController.rejectFamilyDoctor);

router.patch('/cancel-family-doctor/:familyId', doctorController.cancelFamilyDoctor);

router.patch('/approve-family-doctor/:familyId', doctorController.approveFamilyDoctor);
module.exports = router;
