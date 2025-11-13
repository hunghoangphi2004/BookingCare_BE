const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/admin/schedule.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')


router.post(
    '/create-all',        
    scheduleController.createAllSchedules
);
// router.post("/my-schedule/:id", scheduleController.getMyAppointmentsByDoctor);
router.post("/create-schedule", scheduleController.createSchedule);
router.get("/my-appointments", scheduleController.getMyAppointmentsByDoctor);


module.exports = router;