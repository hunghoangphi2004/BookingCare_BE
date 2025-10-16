// routes/specialization.routes.js
const express = require("express");
const router = express.Router();
const specializationController = require("../controllers/specialization.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const upload = require("../middlewares/admin/uploadCloud.middleware");

router.get(
  "/get-all",
  auth,
  role("admin"),
  specializationController.getAllSpec
);

router.post(
  "/create",
  auth,
  role("admin"),
  upload.single("image"),
  specializationController.createSpecialization
);

router.put(
  "/edit/:id",
  auth,
  role("admin"),
  specializationController.editSpecialization
);

router.delete(
  "/delete/:id",
  auth,
  role("admin"),
  specializationController.deleteSpecialization
);

router.get("/:slug", specializationController.getSpecializationBySlug);

// router.patch("/change-status/:status/:id", auth, role("admin"), clinicController.changeStatus);

module.exports = router;
