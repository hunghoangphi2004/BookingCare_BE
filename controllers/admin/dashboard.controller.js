const mongoose = require('mongoose');
const Doctor = require("../../models/doctor.model");
const Clinic = require("../../models/clinic.model");
const Specialization = require("../../models/specialization.model");
const Patient = require("../../models/patient.model");
const Supporter = require("../../models/supporter.model");
const Medicine = require("../../models/medicine.model");
const Prescription = require("../../models/prescription.model");
const Family = require("../../models/family.model");

module.exports.getAllStatistic = async (req, res, next) => {
    try {
        const statistic = {
            doctor: { total: 0, active: 0, inactive: 0 },
            clinic: { total: 0, active: 0, inactive: 0 },
            specialization: { total: 0, active: 0, inactive: 0 },
            patient: { total: 0, active: 0, inactive: 0 },
            supporter: { total: 0, active: 0, inactive: 0 },
            medicine: { total: 0, active: 0, inactive: 0 },
            prescription: { total: 0, active: 0, inactive: 0 },
            family: { total: 0 },
        };

        // --- Doctor ---
        const doctors = await Doctor.find()
            .populate({ path: 'userId', select: 'isActive isDeleted', match: { isDeleted: false } });
        console.log(doctors)
        const validDoctors = doctors.filter(d => d.userId);
        // console.log(validDoctors)
        statistic.doctor.total = validDoctors.length;
        statistic.doctor.active = validDoctors.filter(d => d.userId.isActive).length;
        statistic.doctor.inactive = validDoctors.filter(d => !d.userId.isActive).length;

        // --- Patient ---
        const patients = await Patient.find()
            .populate({ path: 'userId', select: 'isActive isDeleted', match: { isDeleted: false } });
        const validPatients = patients.filter(p => p.userId);
        statistic.patient.total = validPatients.length;
        statistic.patient.active = validPatients.filter(p => p.userId.isActive).length;
        statistic.patient.inactive = validPatients.filter(p => !p.userId.isActive).length;

        // --- Supporter ---
        const supporters = await Supporter.find()
            .populate({ path: 'userId', select: 'isActive isDeleted', match: { isDeleted: false } });
        const validSupporters = supporters.filter(s => s.userId);
        statistic.supporter.total = validSupporters.length;
        statistic.supporter.active = validSupporters.filter(s => s.userId.isActive).length;
        statistic.supporter.inactive = validSupporters.filter(s => !s.userId.isActive).length;

        // --- Clinic ---
        const clinics = await Clinic.find({ isDeleted: false });
        statistic.clinic.total = clinics.length;
        statistic.clinic.active = clinics.filter(c => c.isActive).length;
        statistic.clinic.inactive = clinics.filter(c => !c.isActive).length;

        // --- Specialization ---
        const specializations = await Specialization.find({ isDeleted: false });
        statistic.specialization.total = specializations.length;
        statistic.specialization.active = specializations.filter(s => s.isActive).length;
        statistic.specialization.inactive = specializations.filter(s => !s.isActive).length;

        // --- Medicine ---
        const medicines = await Medicine.find({ isDeleted: false });
        statistic.medicine.total = medicines.length;
        statistic.medicine.active = medicines.filter(m => m.isActive).length;
        statistic.medicine.inactive = medicines.filter(m => !m.isActive).length;

        // --- Prescription ---
        const prescriptions = await Prescription.find({ isDeleted: false });
        statistic.prescription.total = prescriptions.length;
        statistic.prescription.active = prescriptions.filter(p => p.isActive).length;
        statistic.prescription.inactive = prescriptions.filter(p => !p.isActive).length;

        // --- Family ---
        const families = await Family.find();
        statistic.family.total = families.length;

        return res.json({ success: true, statistic });
    } catch (err) {
        next(err);
    }
};
