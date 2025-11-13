const clinicService = require("../../services/clinic.service")
const specializationService = require("../../services/specialization.service")
const doctorService = require("../../services/doctor.service")
const mongoose = require('mongoose');
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util')

module.exports.getAllClinic = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await clinicService.getAllClinic(filters, parseInt(page), parseInt(limit));
        return res.status(200).json({ success: true, ...result })
    } catch (err) {
        next(err)
    }
}

module.exports.getClinicBySlug = async (req, res, next) => {
    const slug = req.params.slug

    try {
        const record = await clinicService.getClinicBySlug(slug);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.getClinicById = async (req, res, next) => {
    const id = req.params.id

    try {
        const record = await clinicService.getClinicById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.getAllSpec = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await specializationService.getAllSpec(filters, parseInt(page), parseInt(limit))
        return res.status(200).json({ success: true, ...result })

    } catch (err) {
        next(err)
    }
}

module.exports.getSpecializationBySlug = async (req, res, next) => {
    const slug = req.params.slug

    try {
        const record = await specializationService.getSpecializationBySlug(slug);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.getSpecializationById = async (req, res, next) => {
    const id = req.params.id

    try {
        const record = await specializationService.getSpecializationById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.getAllDoctor = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, ...filters } = req.query;
        const result = await doctorService.getAllDoctor(filters, parseInt(page), parseInt(limit))
        return res.json({ success: true, ...result });
    } catch (err) {
        next(err)
    }
};

module.exports.getAllFamilyDoctors = async (req, res, next) => {
  try {
    const { specializationId, clinicId, keyword, page, limit } = req.query;
    const filters = { specializationId, clinicId, keyword };

    const result = await doctorService.getAllFamilyDoctors(filters, page, limit);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports.getDoctorBySlug = async (req, res, next) => {

    const slug = req.params.slug

    try {
        const record = await doctorService.getDoctorBySlug(slug);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.getDoctorById = async (req, res, next) => {

    const id = req.params.id

    try {
        const record = await doctorService.getDoctorById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}