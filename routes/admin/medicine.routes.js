const express = require("express");
const router = express.Router();
const medicineController = require("../../controllers/admin/medicine.controller");

router.get('/get-all',  medicineController.getAllMedicine);
router.get('/get-medicine-by-id/:id',  medicineController.getMedicineById);
router.post('/create',  medicineController.createMedicine);
router.patch(
  "/edit/:id",
  medicineController.editMedicine
);
router.delete("/delete/:id", medicineController.deleteMedicine);

module.exports = router;
