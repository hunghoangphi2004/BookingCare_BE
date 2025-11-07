const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError.util")
const Prescription = require('../models/prescription.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const { createPrescriptionPdf } = require('../utils/pdf.util');
const { sendEmail } = require('../utils/email.util');

module.exports.getAllPrescription = async (filters = {}, page = 1, limit = 5) => {
    let find = {isDeleted: false};

    if (filters.keyword) {
        const keywordRegex = { $regex: filters.keyword, $options: "i" };

        const patients = await Patient.find({
            $or: [
                { firstName: keywordRegex },
                { lastName: keywordRegex },
                { phoneNumber: keywordRegex },
            ],
        }).select('_id');

        const patientIds = patients.map(p => p._id);

        find.$or = [
            { diagnosis: keywordRegex },
            { patientId: { $in: patientIds } },
        ];
    }

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, parseInt(limit) || 10);
    const skip = (page - 1) * limit;

    const prescriptions = await Prescription.find(find)
        .populate({
            path: 'doctorId',
            select: 'name phoneNumber specializationId clinicId',
            populate: [
                { path: 'specializationId', select: 'name' },
                { path: 'clinicId', select: 'name' }
            ]
        })
        .populate({
            path: 'patientId',
            select: 'firstName lastName phoneNumber gender dateOfBirth'
        })
        .skip(limit === 0 ? 0 : skip)
        .limit(limit === 0 ? 0 : limit)
        .sort({ createdAt: -1 })
        .lean();

    const total = await Prescription.countDocuments(find);

    return {
        data: prescriptions,
        pagination: {
            total,
            page,
            limit,
            totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
        },
    };
};

module.exports.createPrescription = async (body) => {
    const {
        doctorId,
        patientId,
        diagnosis,
        notes,
        medicines,
    } = body;

    if (!doctorId) {
        throw new AppError("Bác sĩ là bắt buộc", 400);
    }
    if (!patientId) {
        throw new AppError("Bệnh nhân là bắt buộc", 400);
    }
    if (!diagnosis) {
        throw new AppError("Chẩn đoán là bắt buộc", 400);
    }

    const doctor = await Doctor.findOne({ _id: doctorId, isDeleted: false });
    if (!doctor) {
        throw new AppError("Không tìm thấy bác sĩ", 404);
    }

    const patient = await Patient.findOne({ _id: patientId });
    if (!patient) {
        throw new AppError("Không tìm thấy bệnh nhân", 404);
    }

    const newPrescription = new Prescription();
    newPrescription.doctorId = doctorId;
    newPrescription.patientId = patientId;
    newPrescription.diagnosis = diagnosis;
    newPrescription.notes = notes || "";
    newPrescription.medicines = medicines || [];
    newPrescription.status = "draft"

    await newPrescription.save();

    return {
        message: "Tạo toa thuốc thành công",
        prescription: newPrescription,
    };
};

module.exports.addMedicineToPrescription = async (prescriptionId, medicines) => {
    if (!prescriptionId) {
        throw new AppError("Thiếu ID toa thuốc", 400);
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
        throw new AppError("Danh sách thuốc không hợp lệ", 400);
    }

    const prescription = await Prescription.findOne({ _id: prescriptionId, isDeleted: false });
    if (!prescription) {
        throw new AppError("Không tìm thấy toa thuốc", 404);
    }

    prescription.medicines = medicines.map(med => ({
        medicineId: med.medicineId || null,
        name: med.name || "",
        dosage: med.dosage || "",
        duration: med.duration || "",
        instructions: med.instructions || "",
    }));

    prescription.status = "final";

    await prescription.save();

    return {
        message: "Cập nhật toa thuốc thành công",
        prescription,
    };
};

module.exports.getPrescriptionById = async (id) => {
    const find = { _id: id, isDeleted: false };

    const prescription = await Prescription.findOne(find)
        .populate({ path: "patientId", select: "firstName lastName" })
        .populate({ path: "doctorId", select: "name" })
        .populate({
            path: 'medicines.medicineId',
            select: 'name unit usage description'
        });

    if (!prescription) {
        throw new AppError("Không tìm thấy toa thuốc", 404);
    }

    return prescription;
};


module.exports.deletePrescription = async (id) => {
    const prescription = await Prescription.findOne({ _id: id, isDeleted: false });
    if (!prescription) {
        throw new AppError("Không tìm thấy toa thuốc", 404);
    }

    prescription.isDeleted = true;
    await prescription.save();

    return { message: "Xoá toa thuốc thành công" };
};

/**
 * Generate prescription PDF and send it to provided email (or patient's email if not provided)
 * @param {String} id - prescription id
 * @param {String} toEmail - optional recipient email
 */
module.exports.sendPrescriptionPdf = async (id, toEmail) => {
    if (!id) throw new AppError('Thiếu ID toa thuốc', 400);

    // get full prescription
    const prescription = await module.exports.getPrescriptionById(id);

    // find recipient email
    let recipient = toEmail;
    if (!recipient) {
        const patient = await Patient.findOne({ _id: prescription.patientId }).populate('userId');
        recipient = patient?.userId?.email;
    }

    if (!recipient) {
        throw new AppError('Không tìm thấy email người nhận', 400);
    }

    // create pdf
    const pdfBuffer = await createPrescriptionPdf(prescription);

    // send email with attachment
    const subject = 'Toa thuốc của bạn từ BookingCare';
    const html = `<p>Xin chào,</p><p>Đính kèm là toa thuốc của bạn.</p>`;

    await sendEmail(recipient, subject, html, [
        { filename: `prescription-${id}.pdf`, content: pdfBuffer }
    ]);

    return { message: 'Gửi toa thuốc dạng PDF thành công', to: recipient };
}





