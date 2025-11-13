const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const medicineService = require("../../services/medicine.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util')

module.exports.getAllMedicine = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, ...filters } = req.query;
    const result = await medicineService.getAllMedicines(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.createMedicine = async (req, res, next) => {
  try {
    const result = await medicineService.createMedicine(req.body)
    return res.status(201).json({
      success: true,
      message: "Thêm thuốc thành công",
      medicine: result.newMedicine
    });
  } catch (err) {
    next(err)
  }
}

module.exports.editMedicine = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await medicineService.editMedicine(id,data)
    return res.status(201).json({
      success: true,
      message: result.message,
      prescription: result.medicine
    });
  } catch (err) {
    next(err)
  }
}

module.exports.getMedicineById = async (req, res, next) => {
    const id = req.params.id

    try {
        const record = await medicineService.getMedicineById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.deleteMedicine = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await medicineService.deleteMedicine(id)
    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err)
  }
}