const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription.controller.js");
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', auth, prescriptionController.getAllPrescription);
router.get('/get-prescription-by-id/:id', auth,role("admin"), prescriptionController.getPrescriptionById);
router.post('/create',  auth, prescriptionController.createPrescription);
router.patch(
  "/edit/:id",
  auth,
  role("admin"),
  prescriptionController.addMedicineToPrescription
);

router.delete("/delete/:id", auth, role("admin"), prescriptionController.deletePrescription);
router.post('/send-pdf/:id', auth, prescriptionController.sendPrescriptionPdf);

module.exports = router;
