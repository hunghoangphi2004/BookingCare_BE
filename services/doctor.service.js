const mongoose = require('mongoose');
const User = require("../models/user.model")
const Doctor_user = require("../models/doctor.model")
const Clinic = require("../models/clinic.model")
const Specialization = require("../models/specialization.model")
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError.util")
const Appointment = require("../models/appointment.model");


module.exports.getAllDoctor = async (role, userId) => {
    let find;
    let doctors;
    if (role === "admin") {
        find = { isDeleted: false };
    } else if (role === "doctor") {
        find = { isDeleted: false, userId: userId };
    } else {
        throw new AppError("Forbidden: Không có quyền", 403);
    }
    const doctorsRaw = await Doctor_user.find(find);
    doctors = await Doctor_user.find(find)
        .populate({ path: 'userId', select: 'email role', })
        .populate({ path: 'clinicId', select: 'name address phone description image' })
        .populate({ path: 'specializationId', select: 'name description image' });
    return doctors
};

module.exports.getDoctorBySlug = async (slug) => {
    let find = {
        slug: slug,
        isDeleted: false
    };

    let doctor = await Doctor_user.findOne(find);
    if (!doctor) {
        throw new AppError("Không tìm thấy bác sĩ", 404)
    }

    doctor = await Doctor_user.findOne(find)
        .populate({ path: 'userId', select: 'email role', })
        .populate({ path: 'clinicId', select: 'name address phone description' })
        .populate({ path: 'specializationId', select: 'name description' });
    return doctor;
}

module.exports.createDoctor = async (body) => {
    const { email, name, password, thumbnail, phoneNumber, licenceNumber, experience, consultationFee, clinicId, specializationId } = body;

    if (!email) {
        throw new AppError("Email là bắt buộc", 400);
    }
    if (!name) {
        throw new AppError("Name là bắt buộc", 400);
    }
    if (!password) {
        throw new AppError("Password là bắt buộc", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email đã tồn tại", 409);
    }

    let newUser = new User();
    newUser.email = email;
    newUser.password = bcrypt.hashSync(password, 8);
    newUser.role = 'doctor';
    newUser.isDeleted = false;
    await newUser.save();

    let newDoctor = new Doctor_user();
    newDoctor.userId = newUser._id;
    newDoctor.licenseNumber = licenceNumber;
    newDoctor.name = name;
    newDoctor.experience = experience;
    newDoctor.consultationFee = consultationFee;
    newDoctor.phoneNumber = phoneNumber;
    newDoctor.thumbnail = thumbnail,
        newDoctor.clinicId = clinicId;
    newDoctor.specializationId = specializationId;
    newDoctor.isDeleted = false;

    await newDoctor.save();
    return { newUser, newDoctor }
}

module.exports.editDoctor = async (doctorId, body, userRole, userId) => {
    const { phoneNumber, name, licenceNumber, experience, consultationFee, clinicId, specializationId } = body;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const doctor = await Doctor_user.findById(doctorId);
    if (!doctor) {
        throw new AppError("Không tìm thấy bác sĩ", 404)
    }

    // Nếu là doctor, chỉ được sửa profile của mình
    if (userRole === 'doctor') {
        if (doctor.userId.toString() !== userId) {
            throw new AppError("Forbidden: Chỉ được sửa profile của mình", 403)
        }
        if (phoneNumber) doctor.phoneNumber = phoneNumber;
        if (licenceNumber) doctor.licenseNumber = licenceNumber;
        if (experience) doctor.experience = experience;
        if (consultationFee) doctor.consultationFee = consultationFee;
    }
    // Admin có thể sửa tất cả
    else if (userRole === 'admin') {
        if (name) doctor.name = name;
        if (phoneNumber) doctor.phoneNumber = phoneNumber;
        if (licenceNumber) doctor.licenseNumber = licenceNumber;
        if (experience) doctor.experience = experience;
        if (consultationFee) doctor.consultationFee = consultationFee;
        if (clinicId) doctor.clinicId = clinicId;
        if (specializationId) doctor.specializationId = specializationId;
    } else {
        throw new AppError("Forbidden: insufficient role", 403);
    }

    await doctor.save();

    const updatedDoctor = await Doctor_user.findById(doctorId)
        .populate({ path: 'userId', select: 'email role phoneNumber' })
        .populate({ path: 'clinicId', select: 'name address phone description image' })
        .populate({ path: 'specializationId', select: 'name description image' });

    return updatedDoctor;
}

module.exports.deleteDoctor = async (doctorId) => {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const doctor = await Doctor_user.findById(doctorId);
    if (!doctor) {
        throw new AppError("Không tìm thấy bác sĩ", 404)
    }

    doctor.isDeleted = true;
    await doctor.save();
    const user = await User.findById(doctor.userId);
    if (user) {
        user.isDeleted = true;
        await user.save();
    }

    return { message: "Xoá bác sĩ thành công" };
}

module.exports.changeStatus = async (id, status) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const doctor = await Doctor_user.findById(id);
    if (!doctor) {
        throw new AppError("Không tìm thấy bác sĩ", 404)
    }

    if (status !== "active" && status !== "inactive") {
        throw new AppError("Trạng thái phải là 'active' hoặc 'inactive'", 400);
    }

    const user = await User.findById(doctor.userId);
    if (!user) {
        throw new AppError("Không tìm thấy user liên kết", 404);
    }
    if (status === "active") {
        user.isActive = true
    } else {
        user.isActive = false
    }

    await user.save();
    return { message: `Đã đổi trạng thái bác sĩ thành ${status}` };
};

module.exports.getMyAppointments = async() => {
    
}