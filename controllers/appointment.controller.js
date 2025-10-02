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