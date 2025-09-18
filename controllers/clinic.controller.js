const clinicService = require("../services/clinic.service")
const mongoose = require('mongoose');

module.exports.getAllClinic = async (req, res, next) => {
    try {
        const result = await clinicService.getAllClinic();
        return res.status(200).json({ success: true, allClinics: result })
    } catch (err) {
        next(err)
    }
}

module.exports.createClinic = async (req, res, next) => {
    try {
        const newClinic = await clinicService.createClinic(req.body);
        return res.status(200).json({ success: true, clinic: newClinic })
    } catch (err) {
        next(err)
    }
}

module.exports.editClinic = async (req, res, next) => {
    try {
        const updatedClinic = await clinicService.editClinic(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: "Cập nhật phòng khám thành công",
            clinic: updatedClinic
        });

    } catch (err) {
        next(err)
    }
}

module.exports.deleteClinic = async (req, res, next) => {
    try {
        const result = await clinicService.deleteClinic(req.params.id)
        return res.status(200).json({ success: true, message: result.message })
    } catch (err) {
        next(err)
    }
}

module.exports.changeStatus = async (req, res) => {
    try {
        const result = await clinicService.changeStatus(req.params.status, req.params.id)
        return res.status(200).json({ success: true, message: result.message })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error changing status clinic", Error: err.message })
    }
}

