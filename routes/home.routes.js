// routes/doctor.routes.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');



router.get('/', homeController.getHomePage);

// router.post("/create",auth, role("admin"), clinicController.createClinic);

// router.put("/edit/:id", auth, role("admin"), clinicController.editClinic);

// router.delete("/delete/:id", auth, role("admin"), clinicController.deleteClinic);

// router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

module.exports = router;
