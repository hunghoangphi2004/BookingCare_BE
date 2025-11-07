// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', auth, doctorController.getAllDoctor);

router.get('/get-all-family-doctors', doctorController.getAllFamilyDoctors);

router.post("/create",auth, role("admin"),upload.single("thumbnail") ,doctorController.createDoctor);

router.put("/edit/:id", auth, role("admin", "doctor"),upload.single("thumbnail"), doctorController.editDoctor);

router.delete("/delete/:id", auth, role("ad min"), doctorController.deleteDoctor);

router.patch("/change-status/:status/:id", auth, role("admin"), doctorController.changeStatus);

router.get('/getDoctorBySlug/:slug',  doctorController.getDoctorBySlug);

router.get('/getDoctorById/:id',  doctorController.getDoctorById);

router.get(
  "/getAllFamilyRequests",
  auth,
  role("doctor", "admin"),
  doctorController.getFamilyRequestsForDoctor
)

router.put('/reject-family-doctor/:familyId', auth, role("doctor"), doctorController.rejectFamilyDoctor);

router.put('/cancel-family-doctor/:familyId', auth, role("doctor"), doctorController.cancelFamilyDoctor);

router.put('/approve-family-doctor/:familyId', auth, role("doctor"), doctorController.approveFamilyDoctor);
module.exports = router;
