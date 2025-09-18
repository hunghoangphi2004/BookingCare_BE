// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinic.controller');
const auth = require('../middlewares/auth.middleware'); 
const role = require('../middlewares/role.middleware');



router.get('/get-all', auth,role("admin"), clinicController.getAllClinic);

router.post("/create",auth, role("admin"), clinicController.createClinic);

router.put("/edit/:id", auth, role("admin"), clinicController.editClinic);

router.delete("/delete/:id", auth, role("admin"), clinicController.deleteClinic);

router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

module.exports = router;
