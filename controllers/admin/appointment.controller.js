const mongoose = require("mongoose");
const appointmentService = require("../../services/appointment.service")

module.exports.getAllAppointment = async(req, res, next) =>{
    try{
        const record = await appointmentService.getAllAppointment()
        return res.status(201).json({
            success: true,
            message: "Tất cả lịch đặt",
            data: record
        });
    }catch(err){
        next(err)
    }
}

module.exports.changeStatusAppointment = async(req, res, next) =>{
    try{
        const {id, status} = req.params;
        await appointmentService.changeStatusAppointment(id, status)
        return res.status(201).json({
            success: true,
            message: "Thay đổi trạng thái cuộc hẹn thành công",
        });
    }catch(err){
        next(err)
    }
}