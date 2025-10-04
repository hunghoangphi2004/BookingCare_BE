// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')


router.post(
    '/create-all',      
    auth,               
    role('admin'),     
    scheduleController.createAllSchedules
);
router.get("/my-schedule", auth,role("doctor"), scheduleController.getMyAppointmentsByDoctor);
router.get("/doctor/:slug/date/:date", scheduleController.getSchedulesByDoctorAndDate);

module.exports = router;