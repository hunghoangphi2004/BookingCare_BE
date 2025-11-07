const mongoose = require('mongoose');
const User = require("../models/user.model")
const Doctor_user = require("../models/doctor.model")
const Clinic = require("../models/clinic.model")
const Specialization = require("../models/specialization.model")
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError.util")
const Family = require("../models/family.model");
const Appointment = require("../models/appointment.model");


module.exports.getAllDoctor = async (role, userId, filters = {}, page = 1, limit = 10) => {
    let find;
    if (role === "admin") {
        find = { isDeleted: false };
    } else if (role === "doctor") {
        find = { isDeleted: false, userId: userId };
    } else {
        throw new AppError("Forbidden: Không có quyền", 403);
    }

    if (filters.specializationId) find.specializationId = filters.specializationId
    if (filters.clinicId) find.clinicId = filters.clinicId
    if (filters.status) find.status = filters.status
    if (filters.keyword) find.name = { $regex: filters.keyword, $options: "i" };

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, parseInt(limit) || 5);

    const skip = (page - 1) * limit;


    let doctors = await Doctor_user.find(find)
        .populate({ path: 'userId', select: 'email role', })
        .populate({ path: 'clinicId', select: 'name address phone description image' })
        .populate({ path: 'specializationId', select: 'name description image' })
        .skip(limit == 0 ? 0 : skip)
        .limit(limit == 0 ? 0 : limit)
        .lean()

    let total = await Doctor_user.countDocuments(find)


    return {
        data: doctors,
        pagination: {
            total,
            page,
            limit,
            totalPages: limit == 0 ? 1 : Math.ceil(total / limit)
        }
    }
};

module.exports.getAllFamilyDoctors = async (filters = {}, page = 1, limit = 10) => {
    try {
        const find = {
            isFamilyDoctor: true
        };

        if (filters.specializationId) find.specializationId = filters.specializationId;
        if (filters.clinicId) find.clinicId = filters.clinicId;
        if (filters.keyword) find.name = { $regex: filters.keyword, $options: "i" };

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);
        const skip = (page - 1) * limit;

        const doctors = await Doctor_user.find(find)
            .populate({ path: 'userId', select: 'email role' })
            .populate({ path: 'clinicId', select: 'name address phone description image' })
            .populate({ path: 'specializationId', select: 'name description image' })
            .skip(limit === 0 ? 0 : skip)
            .limit(limit === 0 ? 0 : limit)
            .sort({ createdAt: -1 })
            .lean();

        console.log("doctors:", doctors);

        const total = await Doctor_user.countDocuments(find);

        return {
            success: true,
            data: doctors,
            pagination: {
                total,
                page,
                limit,
                totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
            }
        };

    } catch (error) {
        throw new AppError(error.message, 500);
    }
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

module.exports.getDoctorById = async (id) => {
    let find = {
        _id: id,
        isDeleted: false
    };

    let doctor = await Doctor_user.findOne(find);
    console.log("doctor:", doctor);
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
    const { email, name, password, thumbnail, phoneNumber, licenseNumber, experience, consultationFee, clinicId, specializationId } = body;
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
    newDoctor.licenseNumber = licenseNumber;
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
    const { phoneNumber, name, licenseNumber, experience, consultationFee, clinicId, specializationId, password, thumbnail } = body;

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
        if (licenseNumber) doctor.licenseNumber = licenseNumber;
        if (experience) doctor.experience = experience;
        if (consultationFee) doctor.consultationFee = consultationFee;
    }
    // Admin có thể sửa tất cả
    else if (userRole === 'admin') {
        if (name) doctor.name = name;
        if (phoneNumber) doctor.phoneNumber = phoneNumber;
        if (licenseNumber) doctor.licenseNumber = licenseNumber;
        if (experience) doctor.experience = experience;
        if (consultationFee) doctor.consultationFee = consultationFee;
        if (clinicId) doctor.clinicId = clinicId;
        if (specializationId) doctor.specializationId = specializationId;
        if (thumbnail) doctor.thumbnail = thumbnail;
        if (password) {
            const user = await User.findById(doctor.userId);
            if (!user) throw new AppError("Không tìm thấy user liên kết", 404);
            user.password = bcrypt.hashSync(password, 8);
            await user.save();
        }
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

module.exports.getMyAppointments = async () => {

}

module.exports.approveFamilyDoctorService = async (Doctor_userId, familyId) => {
    const doctor = await Doctor_user.findOne({ userId: Doctor_userId });
    if (!doctor) throw new AppError('Không tìm thấy hồ sơ bác sĩ', 404);

    const family = await Family.findById(familyId);
    if (!family) throw new AppError('Không tìm thấy hồ sơ gia đình', 404);

    const request = family.familyDoctors.find(fd => {
        const doctorId = fd.doctorId?._id ? fd.doctorId._id.toString() : fd.doctorId.toString();
        return doctorId === doctor._id.toString() && fd.status === 'pending';
    });

    if (!request) throw new AppError('Không có yêu cầu nào đang chờ duyệt', 400);

    request.status = 'approved';
    request.approvedAt = new Date();

    await family.save();

    return {
        success: true,
        message: 'Đã duyệt yêu cầu thành công',
        data: request,
    };
};

module.exports.rejectFamilyDoctor = async (Doctor_userId, familyId, reason) => {
    const doctor = await Doctor_user.findOne({ userId: Doctor_userId });
    if (!doctor) throw new AppError('Không tìm thấy hồ sơ bác sĩ', 404);

    const family = await Family.findById(familyId);
    if (!family) throw new AppError('Không tìm thấy hồ sơ gia đình', 404);

    const request = family.familyDoctors.find(fd =>
        fd.doctorId.toString() === doctor._id.toString() && fd.status === 'pending'
    );

    if (!request) throw new AppError('Không có yêu cầu nào để từ chối', 400);

    request.status = 'rejected';
    request.rejectionReason = reason || 'Không nêu lý do';
    request.rejectedAt = new Date();

    await family.save();

    return {
        success: true,
        message: 'Đã từ chối yêu cầu thành công',
        family,
    };
};

module.exports.cancelFamilyDoctor = async (Doctor_userId, familyId) => {
    const doctor = await Doctor_user.findOne({ userId: Doctor_userId });
    if (!doctor) throw new AppError('Không tìm thấy hồ sơ bác sĩ', 404);

    const family = await Family.findById(familyId);
    if (!family) throw new AppError('Không tìm thấy hồ sơ gia đình', 404);

    const request = family.familyDoctors.find(fd =>
        fd.doctorId.toString() === doctor._id.toString() && fd.status === 'pending'
    );

    if (!request) throw new AppError('Không có yêu cầu nào để hủy', 400);

    request.status = 'cancelled';
    request.cancelledAt = new Date();

    await family.save();

    return {
        success: true,
        message: 'Đã hủy yêu cầu thành công',
        family,
    };
};

module.exports.getFamilyRequestsForDoctor = async (role, userId, filters = {}, page = 1, limit = 10) => {
    let doctor;

    if (role === 'doctor') {
        doctor = await Doctor_user.findOne({ userId });
        if (!doctor) throw new AppError('Không tìm thấy hồ sơ bác sĩ', 404);
    } else if (role === 'admin') {
        // admin có thể xem tất cả
    } else {
        throw new AppError('Forbidden: Không có quyền truy cập', 403);
    }

    const findQuery = {};

    if (role === 'doctor') {
        findQuery['familyDoctors.doctorId'] = doctor._id;
    }

    if (filters.status) {
        findQuery['familyDoctors.status'] = filters.status;
    }

    if (filters.keyword) {
        findQuery['familyName'] = { $regex: filters.keyword, $options: 'i' };
    }

    if (filters.fromDate || filters.toDate) {
        const dateQuery = {};
        if (filters.fromDate) dateQuery.$gte = new Date(filters.fromDate);
        if (filters.toDate) dateQuery.$lte = new Date(filters.toDate);
        findQuery['familyDoctors.requestedAt'] = dateQuery;
    }

    // ⚙️ Phân trang (đưa ra ngoài)
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, parseInt(limit) || 10);
    const skip = (page - 1) * limit;

    // 📦 Query
    let families = await Family.find(findQuery)
        .populate('ownerId', 'fullName email phoneNumber')
        .populate('familyDoctors.doctorId', 'name specializationId')
        .populate('familyDoctors.handledBy', 'name')
        .skip(limit === 0 ? 0 : skip)
        .limit(limit === 0 ? 0 : limit)
        .sort({ createdAt: -1 })
        .lean();

    console.log("families trước lọc:", families);
    console.log("doctor._id:", doctor._id.toString());
    console.log("familyDoctors của family:", families[0].familyDoctors);
    if (role === 'doctor') {
        families = families.map(family => {
            // Lọc ra tất cả yêu cầu của bác sĩ này
            const doctorRequests = family.familyDoctors.filter(fd => {
                const id = fd.doctorId?._id ? fd.doctorId._id.toString() : fd.doctorId?.toString();
                return id === doctor._id.toString();
            });

            return {
                _id: family._id,
                familyName: family.familyName,
                owner: family.ownerId,
                members: family.members,
                doctorRequests, // ✅ chứa danh sách tất cả yêu cầu của bác sĩ
            };
        }).filter(f => f.doctorRequests.length > 0);
    }


    const total = await Family.countDocuments(findQuery);

    return {
        success: true,
        data: families,
        pagination: {
            total,
            page,
            limit,
            totalPages: limit === 0 ? 1 : Math.ceil(total / limit)
        }
    };
};
