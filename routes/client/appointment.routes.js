const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/client/appointment.controller');

router.post('/create',  appointmentController.createAppointment);

module.exports = router;
