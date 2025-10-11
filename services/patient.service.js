const AppError = require("../utils/appError.util")
const Patient = require("../models/patient.model")

module.exports.getPatientById = async (id) => {
    let find = {
        _id: id,
    };

    let patient = await Patient.findOne(find);
    if (!patient) {
        throw new AppError("Không tìm thấy bệnh nhân", 404)
    }

    patient = await Patient.findOne(find)
        .populate({ path: 'userId', select: 'email role', })
    return patient;
}