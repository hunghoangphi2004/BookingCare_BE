const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/client/schedule.controller');

router.get("/:slug/date/:date", scheduleController.getSchedulesByDoctorAndDate);

module.exports = router;