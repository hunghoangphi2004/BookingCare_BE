const clinicService = require("../../services/clinic.service")
const mongoose = require('mongoose');
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util');
const { log } = require("console");

module.exports.getAllClinic = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await clinicService.getAllClinic(filters, parseInt(page), parseInt(limit));
        return res.status(200).json({ success: true, ...result })
    } catch (err) {
        next(err)
    }
}

module.exports.createClinic = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            // Upload lên Cloudinary
            const result = await uploadToCloudinary(
                req.file.path,
                "clinics"
            );
            imageUrl = result.secure_url;

            // Xóa file tạm
            fs.unlinkSync(req.file.path);
        }
        const newClinic = await clinicService.createClinic({
            ...req.body,
            image: imageUrl,
        });
        return res.status(200).json({ success: true, clinic: newClinic })
    } catch (err) {
        next(err)
    }
}

module.exports.editClinic = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "clinics"
            );
            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }
        const updatedClinic = await clinicService.editClinic(
            req.params.id,
            { ...req.body, image: imageUrl },
        )
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
        return res.status(500).json({ success: false, message: "Có lôi xảy ra khi đổi trạng thái phòng khám", Error: err.message })
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