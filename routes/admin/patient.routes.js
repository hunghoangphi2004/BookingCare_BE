const express = require("express");
const router = express.Router();
const patientController = require("../../controllers/admin/patient.controller");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', patientController.getAllPatient);
router.get('/get-patient-by-id/:id', patientController.getPatientById);
router.post('/create', upload.single("thumbnail"), patientController.createPatient);
router.patch('/edit/:id', upload.single("thumbnail"), patientController.editPatient);
router.patch('/change-status/:status/:id', patientController.changeStatus);
router.delete('/delete/:id', patientController.deletePatient);

module.exports = router;
