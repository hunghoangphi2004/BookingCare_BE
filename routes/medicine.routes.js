const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicine.controller");
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = require('../middlewares/admin/uploadCloud.middleware')

router.get('/get-all', auth, medicineController.getAllMedicine);
router.get('/get-medicine-by-id/:id', auth,role("admin"), medicineController.getMedicineById);
router.post('/create', auth, medicineController.createMedicine);
router.patch(
  "/edit/:id",
  auth,
  role("admin"),
  medicineController.editMedicine
);

router.delete("/delete/:id", auth, role("admin"), medicineController.deleteMedicine);

module.exports = router;
