const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const prescriptionService = require("../../services/prescription.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util')

module.exports.getAllPrescription = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, ...filters } = req.query;
    const result = await prescriptionService.getAllPrescription(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllPrescriptionByDoctor = async (req, res, next) => {
  try {
    console.log(req.user.id)
    const { page = 1, limit = 5, ...filters } = req.query;
    filters.userId = req.user.id;

    const result = await prescriptionService.getAllPrescription(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.createPrescription = async (req, res, next) => {
  try {
    const result = await prescriptionService.createPrescription(req.body)
    return res.status(201).json({
      success: true,
      message: result.message,
      prescription: result.prescription
    });
  } catch (err) {
    next(err)
  }
}

module.exports.addMedicineToPrescription = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body.medicines;
    const result = await prescriptionService.addMedicineToPrescription(id,data)
    return res.status(201).json({
      success: true,
      message: result.message,
      prescription: result.prescription
    });
  } catch (err) {
    next(err)
  }
}

module.exports.getPrescriptionById = async (req, res, next) => {
    const id = req.params.id

    try {
        const record = await prescriptionService.getPrescriptionById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}


module.exports.deletePrescription = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await prescriptionService.deletePrescription(id)
    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err)
  }
}

module.exports.sendPrescriptionPdf = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { email } = req.body || {};
    const result = await prescriptionService.sendPrescriptionPdf(id, email);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}