const patientService = require("../../services/patient.service");
const fs = require("fs");
const { uploadToCloudinary } = require("../../utils/cloudinary.util");

module.exports.getAllPatient = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await patientService.getAllPatient(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.createPatient = async (req, res, next) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "patients");
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 
    }

    const newPatient = await patientService.createPatient({
      ...req.body,
      thumbnail: imageUrl,
    });

    return res.status(200).json({ success: true, patient: newPatient });
  } catch (err) {
    next(err);
  }
};

module.exports.editPatient = async (req, res, next) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "patients");
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedPatient = await patientService.editPatient(
      req.params.id,
      { ...req.body, thumbnail: imageUrl },
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin bệnh nhân thành công",
      patient: updatedPatient,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deletePatient = async (req, res, next) => {
  try {
    const result = await patientService.deletePatient(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const result = await patientService.changeStatus(req.params.id,req.params.status);
    console.log(req.params.id,req.params.status)
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error changing patient status",
      Error: err.message,
    });
  }
};

module.exports.getPatientById = async (req, res, next) => {
  try {
    const record = await patientService.getPatientById(req.params.id);
    return res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
