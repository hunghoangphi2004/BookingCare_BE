const mongoose = require("mongoose");
const appointmentService = require("../../services/appointment.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util');

module.exports.createAppointment = async(req, res, next) =>{
    try{

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.path, "appointments");
                imageUrls.push(result.secure_url);

                fs.unlinkSync(file.path); // xóa file tạm
            }
        }
        const record = await appointmentService.createAppointment({ ...req.body, images: imageUrls }, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Đặt lịch thành công",
            data: record
        });
    }catch(err){
        next(err)
    }
}