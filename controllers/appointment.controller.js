const mongoose = require("mongoose");
const Doctor_user = require("../models/doctor.model")
const PatientProfile = require("../models/patient.model")
const Appointment = require("../models/appointment.model")
const appointmentService = require("../services/appointment.service")

module.exports.createAppointment = async(req, res, next) =>{
    try{
        const record = await appointmentService.createAppointment(req.body,req.user);
        return res.status(201).json({
            success: true,
            message: "Đặt lịch thành công",
            data: record
        });
    }catch(err){
        next(err)
    }
}

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
        console.log(id,status)
        await appointmentService.changeStatusAppointment(id, status)
        return res.status(201).json({
            success: true,
            message: "Thay đổi trạng thái cuộc hẹn thành công",
        });
    }catch(err){
        next(err)
    }
}