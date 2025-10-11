const mongoose = require('mongoose');
const Specialization = require("../models/specialization.model");
const specializationService = require("../services/specialization.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../utils/cloudinary.util')

module.exports.getAllSpec = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;
        const result = await specializationService.getAllSpec(filters, parseInt(page), parseInt(limit))
        return res.status(200).json({ success: true, ...result })

    } catch (err) {
        next(err)
    }
}

module.exports.createSpecialization = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            // Upload lên Cloudinary
            const result = await uploadToCloudinary(
                req.file.path,
                "specializations"
            );
            imageUrl = result.secure_url;

            // Xóa file tạm
            fs.unlinkSync(req.file.path);
        }
        const newSpecialization = await specializationService.createSpecialization({
            ...req.body,
            image: imageUrl,
        });

        // const newSpecialization = await specializationService.createSpecialization(req.body)
        return res.status(200).json({ success: true, newSpecialization: newSpecialization })
    } catch (err) {
        next(err)
    }
}

module.exports.editSpecialization = async (req, res, next) => {
    try {
        const updatedSpecialization = await specializationService.editSpecialization(req.params.id, req.body)
        return res.status(200).json({
            success: true,
            message: "Cập nhật chuyên khoa thành công",
            specialization: updatedSpecialization
        });

    } catch (err) {
        next(err)
    }
}

module.exports.deleteSpecialization = async (req, res, next) => {
    try {
        const result = await specializationService.deleteSpecialization(req.params.id)

        return res.status(200).json({ success: true, message: result.message })
    } catch (err) {
        next(err)
    }
}

module.exports.getSpecializationBySlug = async (req, res, next) => {
    const slug = req.params.slug

    try {
        const record = await specializationService.getSpecializationBySlug(slug);
        return res.status(200).json({ success: true, data: record })
    } catch (err) {
        next(err)
    }
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

