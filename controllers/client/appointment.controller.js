const mongoose = require("mongoose");
const appointmentService = require("../../services/appointment.service")

module.exports.createAppointment = async(req, res, next) =>{
    try{
        const record = await appointmentService.createAppointment(req.body, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Đặt lịch thành công",
            data: record
        });
    }catch(err){
        next(err)
    }
}