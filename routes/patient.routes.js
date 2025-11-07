const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', auth, patientController.getAllPatient);
router.get('/get-patient-by-id/:id', auth, patientController.getPatientById);
router.post('/create', upload.single("thumbnail"), auth, role("admin"), patientController.createPatient);
router.patch('/edit/:id', upload.single("thumbnail"), auth, role("admin"), patientController.editPatient);
router.patch('/change-status/:id/:status', auth, role("admin"), patientController.changeStatus);
router.delete('/delete/:id',auth, role("admin"), patientController.deletePatient);

module.exports = router;
