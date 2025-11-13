const express = require('express');
const router = express.Router();
const clinicController = require('../../controllers/admin/clinic.controller');
const role = require('../../middlewares/client/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')


router.get('/get-all', clinicController.getAllClinic);

router.post("/create",upload.single("image"), clinicController.createClinic);

router.patch("/edit/:id",upload.single("image"), clinicController.editClinic);

router.delete("/delete/:id", clinicController.deleteClinic);

router.patch("/change-status/:status/:id", clinicController.changeStatus);

router.get('/get-clinic-by-id/:id', clinicController.getClinicById);

module.exports = router;
