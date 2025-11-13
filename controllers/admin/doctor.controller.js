const mongoose = require('mongoose');
const doctorService = require("../../services/doctor.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util')

module.exports.getAllDoctor = async (req, res, next) => {
    try {
        const { page = 1, limit = 5, ...filters } = req.query;

        const result = await doctorService.getAllDoctor(req.user.role, req.user.id, filters, parseInt(page), parseInt(limit))
        return res.json({ success: true, ...result });
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

        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.path,
                "doctors"
            );
            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }
        const updatedDoctor = await doctorService.editDoctor(
            req.params.id,
            { ...req.body, thumbnail: imageUrl },
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
        await doctorService.changeStatus(id, status)
        return res.status(200).json({ success: true, message: "Đổi trạng thái bác sĩ thành công" });
    } catch (err) {
        next(err)
    }
};

module.exports.getDoctorById = async (req, res, next) => {

    const id = req.params.id

    try {
        const record = await doctorService.getDoctorById(id);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
}

module.exports.approveFamilyDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.approveFamilyDoctorService(req.user.id, req.params.familyId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports.rejectFamilyDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.rejectFamilyDoctor(req.user.id, req.params.familyId, req.body.reason);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports.cancelFamilyDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.cancelFamilyDoctor(req.user.id, req.params.familyId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports.getFamilyRequestsForDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.getFamilyRequestsForDoctor(
      req.user.role,
      req.user.id,
      req.query,
      req.query.page,
      req.query.limit
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

