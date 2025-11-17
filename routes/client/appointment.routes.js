const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/client/appointment.controller');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../../middlewares/admin/uploadCloud.middleware')

router.post('/create', upload.array('images', 5), appointmentController.createAppointment);

module.exports = router;
