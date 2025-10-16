// routes/supporter.routes.js
const express = require("express");
const router = express.Router();
const supporterController = require("../controllers/supporter.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const upload = require("../middlewares/admin/uploadCloud.middleware");

// router.get('/get-all', auth, doctorController.getAllDoctor);

router.post(
  "/create",
  auth,
  role("admin"),
  upload.single("thumbnail"),
  supporterController.createSupporter
);

// router.put("/edit/:id", auth, role("admin", "doctor"), doctorController.editDoctor);

// router.delete("/delete/:id", auth, role("admin"), doctorController.deleteDoctor);

// router.patch("/change-status/:status/:id", auth, role("admin"), doctorController.changeStatus);

// router.get('/:slug',  doctorController.getDoctorBySlug);

module.exports = router;
