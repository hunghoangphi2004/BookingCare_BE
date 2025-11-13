const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/client/home.controller');

router.get('/get-all-clinic', homeController.getAllClinic);

router.get('/get-clinic-by-slug/:slug', homeController.getClinicBySlug);

router.get('/get-clinic-by-id/:id', homeController.getClinicById);

router.get('/get-all-specialization', homeController.getAllSpec);

router.get('/get-specialization-by-slug/:slug', homeController.getSpecializationBySlug);

router.get('/get-specialization-by-id/:id', homeController.getSpecializationById);

router.get('/get-all-doctor', homeController.getAllDoctor);

router.get('/get-all-family-doctor', homeController.getAllFamilyDoctors);

router.get('/get-doctor-by-id/:id', homeController.getDoctorById);

router.get('/get-doctor-by-slug/:slug', homeController.getDoctorBySlug);

module.exports = router;
