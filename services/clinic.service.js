const Clinic = require("../models/clinic.model")
const AppError = require("../utils/appError.util")
const mongoose = require('mongoose');

module.exports.getAllClinic = async (filters = {}, page = 1, limit = 10) => {
    let find = { isDeleted: false };
    if (filters.keyword) {
        find.name = { $regex: filters.keyword, $options: "i" };
    }

    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, parseInt(limit) || 10);

    const skip = (page - 1) * limit;

    const total = await Clinic.countDocuments(find);

    const clinics = await Clinic.find(find).select("-__v")
        .skip(limit == 0 ? 0 : skip)
        .limit(limit == 0 ? 0 : limit)
        .sort({ createdAt: -1 })
        .lean();
    return {
        data: clinics,
        pagination: {
            total,
            page,
            limit,
            totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
        },
    };
}

module.exports.createClinic = async (body) => {
    const { name, address, openingHours, phone, description, image } = body;

    if (!name || !address || !openingHours || !phone || !image) {
        throw new AppError("Bắt buộc tất cả các trường", 400);
    }

    let newClinic = new Clinic();
    newClinic.name = name;
    newClinic.description = description;
    newClinic.address = address;
    newClinic.openingHours = openingHours;
    newClinic.phone = phone;
    newClinic.image = image;

    await newClinic.save();
    return newClinic;
}

module.exports.editClinic = async (clinicId, body) => {
    const { name, address, openingHours, phone, description, image,isActive } = body;

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
        throw new AppError("Không tìm thấy phòng khám", 404)
    }

    if (name) clinic.name = name;
    if (address) clinic.address = address;
    if (openingHours) clinic.openingHours = openingHours;
    if (phone) clinic.phone = phone;
    if (description) clinic.description = description;
    if (image) clinic.image = image;
    if (isActive !== undefined) {
        if (isActive === "true" || isActive === true) {
            clinic.isActive = true;
        } else if (isActive === "false" || isActive === false) {
            clinic.isActive = false;
        } else {
            throw new AppError("Giá trị isActive không hợp lệ (chỉ nhận true/false)", 400);
        }
    }

    await clinic.save();
    const updatedClinic = await Clinic.findById(clinicId)

    return updatedClinic
}

module.exports.deleteClinic = async (clinicId) => {
    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const clinic = await Clinic.findById(clinicId)
    if (!clinic) {
        throw new AppError("Không tìm thấy phòng khám", 404)
    }

    clinic.isDeleted = true;
    await clinic.save();
    return { message: "Xoá phòng khám thành công" };
}

module.exports.changeStatus = async (status, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const clinic = await Clinic.findById(id)
    if (!clinic) {
        throw new AppError("Không tìm thấy phòng khám", 404)
    }

    if (status !== "active" && status !== "inactive") {
        throw new AppError("Trạng thái phải là 'active' hoặc 'inactive'", 400);
    }

    if (status === "active") {
        clinic.isActive = true;
    } else {
        clinic.isActive = false;
    }

    await clinic.save()

    return { message: `Đã đổi trạng thái phòng khám thành ${status}` };
}

module.exports.getClinicBySlug = async (slug) => {
    let find = {
        slug: slug,
        isDeleted: false
    };

    let clinic = await Clinic.findOne(find);
    if (!clinic) {
        throw new AppError("Không tìm thấy phòng khám", 404)
    }

    clinic = await Clinic.findOne(find)
    return clinic;
}

module.exports.getClinicById = async (id) => {
    let find = {
        _id: id,
        isDeleted: false
    };

    let clinic = await Clinic.findOne(find);
    if (!clinic) {
        throw new AppError("Không tìm thấy phòng khám", 404)
    }

    clinic = await Clinic.findOne(find)
    return clinic;
}
