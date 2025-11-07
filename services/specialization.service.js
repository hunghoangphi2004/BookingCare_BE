const mongoose = require('mongoose');
const Specialization = require("../models/specialization.model");
const AppError = require("../utils/appError.util")

module.exports.getAllSpec = async (filters = {}, page = 1, limit = 10) => {
    try {
        let find = { isDeleted: false };

        if (filters.keyword) {
            find.name = { $regex: filters.keyword, $options: "i" }; 
        }

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);

        const skip = (page - 1) * limit;

        const total = await Specialization.countDocuments(find);

        const specs = await Specialization.find(find)
            .skip(limit == 0 ? 0 : skip)
            .limit(limit == 0 ? 0 : limit)
            .sort({ createdAt: -1 }) 
            .lean();

        return {
            data: specs,
            pagination: {
                total,
                page,
                limit,
                totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
            },
        };
    } catch (err) {
        throw new Error("Lỗi khi lấy danh sách chuyên khoa: " + err.message);
    }
}

module.exports.createSpecialization = async (body) => {
    const { name, description, image } = body;

    if (!name) {
        throw new AppError("Bắt buộc tên", 400);
    }
    if (!description) {
        throw new AppError("Bắt buộc mô tả", 400);
    }
    if (!image) {
        throw new AppError("Bắt buộc ảnh", 400);
    }

    let newSpecialization = new Specialization();
    newSpecialization.name = name;
    newSpecialization.description = description;
    newSpecialization.image = image;

    await newSpecialization.save();
    return newSpecialization
}

module.exports.editSpecialization = async (specializationId, body) => {
    const { name, description, image } = body;

    if (!mongoose.Types.ObjectId.isValid(specializationId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const specialization = await Specialization.findById(specializationId);
    if (!specialization) {
        throw new AppError("Không tìm thấy chuyên khoa", 404)
    }

    if (name) specialization.name = name;
    if (description) specialization.description = description;
    if (image) specialization.image = image;

    await specialization.save();
    const updatedSpecialization = await Specialization.findById(specializationId)

    return updatedSpecialization
}

module.exports.deleteSpecialization = async (specializationId) => {

    if (!mongoose.Types.ObjectId.isValid(specializationId)) {
        throw new AppError("Id không hợp lệ", 400)
    }

    const specialization = await Specialization.findById(specializationId)
    if (!specialization) {
        throw new AppError("Không tìm thấy chuyên khoa", 404)
    }

    specialization.isDeleted = true;
    await specialization.save();

    return { message: "Xoá chuyên khoa thành công" };
}

module.exports.getSpecializationBySlug = async (slug) => {
    let find = {
        slug: slug,
        isDeleted: false
    };

    let specialization = await Specialization.findOne(find);
    if (!specialization) {
        throw new AppError("Không tìm thấy chuyên khoa", 404)
    }

    specialization = await Specialization.findOne(find)
    return specialization;
}

module.exports.getSpecializationById = async (id) => {
    let find = {
        _id: id,
        isDeleted: false
    };

    let specialization = await Specialization.findOne(find);
    if (!specialization) {
        throw new AppError("Không tìm thấy chuyên khoa", 404)
    }

    specialization = await Specialization.findOne(find)
    return specialization;
}


// module.exports.changeStatus = async (req, res) => {
//     try {
//         const { status, id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ success: false, message: "Invalid specialization ID" });
//         }

//         const specialization = await Specialization.findById(id)
//         if(!specialization){
//             return res.status(404).json({success: false,message: "Specialization not found"})
//         }

//         if(status!=="active" && status !== "inactive"){
//             return res.status(400).json({ success: false, message: "Status must be 'active' or 'inactive'" });
//         }

//         if(status === "active"){
//             specialization.isActive = true;
//         } else {
//             specialization.isActive=false;
//         }

//         await specialization.save()

//         return res.status(200).json({ success: true,message: "Change status successfully" })
//     } catch (err) {
//         return res.status(500).json({ success: false, message: "Error changing status specialization", Error: err.message })
//     }
// }

