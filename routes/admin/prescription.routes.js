const express = require("express");
const router = express.Router();
const prescriptionController = require("../../controllers/admin/prescription.controller.js");

router.get('/get-all', prescriptionController.getAllPrescription);
router.get('/get-prescription-by-id/:id', prescriptionController.getPrescriptionById);
router.post('/create',  prescriptionController.createPrescription);
router.patch(
  "/edit/:id",
  prescriptionController.addMedicineToPrescription
);

//bác sĩ
router.get('/my-prescriptions', prescriptionController.getAllPrescriptionByDoctor);

router.delete("/delete/:id", prescriptionController.deletePrescription);
router.post('/send-pdf/:id', prescriptionController.sendPrescriptionPdf);

module.exports = router;
