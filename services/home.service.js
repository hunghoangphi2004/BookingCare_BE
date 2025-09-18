const Clinic = require("../models/clinic.model")
const Specialization = require("../models/specialization.model")
const AppError = require("../utils/appError.util")
const Doctor_user = require("../models/doctor.model")

module.exports.getAllClinic = async () => {
    const clinics = await Clinic.find({ isDeleted: false, isActive: true })
        .select("name address openingHours phone description image slug");
    return clinics;
}

module.exports.getAllSpecialization = async () => {
    const specialization = await Specialization.find({ isDeleted: false})
        .select("name description image slug");
    return specialization;
}

module.exports.getActiveDoctors = async () => {
    const doctors = await Doctor_user.find({ isDeleted: false })
        .select("name thumbnail experience consultationFee slug clinicId specializationId")
        .populate({
            path: "userId",
            match: { isActive: true, isDeleted: false },
            select: "email"
        })
        .populate({
            path: "clinicId",
            select: "name address"
        })
        .populate({
            path: "specializationId",
            select: "name"
        });

    return doctors.filter(doc => doc.userId !== null);
};