const mongoose = require('mongoose');
const User = require("../models/user.model")
const Doctor_user = require("../models/doctor.model")
const Clinic = require("../models/clinic.model")
const Specialization = require("../models/specialization.model")
const bcrypt = require("bcryptjs");
const doctorService = require("../services/doctor.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../utils/cloudinary.util')

module.exports.getAllDoctor = async (req, res, next) => {
    try {
        const doctors = await doctorService.getAllDoctor(req.user.role, req.user.id)
        return res.json({ success: true, data: doctors });
    } catch (err) {
        next(err)
    }
};

module.exports.createDoctor = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            // Upload lên Cloudinary
            const result = await uploadToCloudinary(
                req.file.path,
                "doctors"
            );
            imageUrl = result.secure_url;

            // Xóa file tạm
            fs.unlinkSync(req.file.path);
        }

        const { newUser, newDoctor } = await doctorService.createDoctor({ ...req.body, thumbnail: imageUrl })
        return res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            user: newUser,
            doctor: newDoctor
        });
    } catch (err) {
        next(err)
    }
}

module.exports.editDoctor = async (req, res, next) => {
    try {
        const updatedDoctor = await doctorService.editDoctor(
            req.params.id,
            req.body,
            req.user.role,
            req.user.id
        )
        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            doctor: updatedDoctor
        });
    } catch (err) {
        next(err)
    }
}

module.exports.deleteDoctor = async (req, res, next) => {
    try {

        const result = await doctorService.deleteDoctor(req.params.id);

        return res.status(200).json({ success: true, message: result.message });
    } catch (err) {
        next(err)
    }
}

module.exports.changeStatus = async (req, res, next) => {
    try {
        const { status, id } = req.params;
        const result = await doctorService.changeStatus(id, status)
        return res.status(200).json({ success: true, message: "Đổi trạng thái bác sĩ thành công" });
    } catch (err) {
        next(err)
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
