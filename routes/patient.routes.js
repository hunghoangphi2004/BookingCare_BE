const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");
const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');

router.put("/profile",auth, patientController.updateProfile);
router.get('/getPatientById/:id', auth, patientController.getPatientById);

module.exports = router;
