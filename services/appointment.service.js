const mongoose = require("mongoose");
const PatientProfile = require("../models/patient.model")
const Appointment = require("../models/appointment.model")
const Doctor_user = require("../models/doctor.model")
const AppError = require("../utils/appError.util")
const Schedule = require("../models/schedule.model")
const moment = require("moment")

module.exports.createAppointment = async (body, user) => {

    const { doctorId, dateBooking, timeBooking, description } = body;
    const patientId = user.id;

    if (!doctorId) throw new AppError("Thiếu doctorId", 400);
    if (!patientId) throw new AppError("Thiếu patientId", 400);
    if (!dateBooking) throw new AppError("Thiếu ngày đặt lịch", 400);
    if (!timeBooking) throw new AppError("Thiếu giờ đặt lịch", 400);

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new AppError("doctorId không hợp lệ", 400);
    }

    // 2. Kiểm tra bác sĩ tồn tại không
    const doctor = await Doctor_user.findById(doctorId);
    if (!doctor || doctor.isDeleted) {
        throw new AppError("Không tìm thấy bác sĩ", 404);
    }

    const count = await Appointment.countDocuments({
        doctorId,
        dateBooking,
        timeBooking,
        status: { $ne: "cancelled" }
    });
    if (count >= 1) {
        throw new AppError("Khung giờ này đã có bệnh nhân khác đặt", 400);
    }

    const newAppointment = new Appointment({
        doctorId,
        patientId,
        dateBooking,
        timeBooking,
        description,
        status: "pending"
    })

    await newAppointment.save();

    const schedule = await Schedule.findOne({
        doctorId,
        date: moment(dateBooking).format("DD/MM/YYYY"),
        time: timeBooking 
    });

    if (!schedule) throw new AppError("Schedule không tồn tại", 404);

    schedule.sumBooking += 1;
    await schedule.save();

    return newAppointment;
}