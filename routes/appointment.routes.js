// routes/appointment.routes.js
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const upload = require("../middlewares/admin/uploadCloud.middleware");

router.post(
  "/create",
  auth,
  role("patient"),
  appointmentController.createAppointment
);
router.get(
  "/get-all",
  auth,
  role("admin", "supporter"),
  appointmentController.getAllAppointment
);
router.post(
  "/change-status/:id/:status",
  auth,
  role("supporter"),
  appointmentController.changeStatusAppointment
);

// router.post("/create",auth, role("admin"),upload.single("image"), clinicController.createClinic);

// router.put("/edit/:id", auth, role("admin"), clinicController.editClinic);

// router.delete("/delete/:id", auth, role("admin"), clinicController.deleteClinic);

// router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

// router.get('/:slug', clinicController.getClinicBySlug);

module.exports = router;
