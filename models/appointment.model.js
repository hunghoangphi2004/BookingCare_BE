// models/appointment.model.js
const mongoose = require('mongoose');
const moment = require('moment')
const Schedule = require("../models/schedule.model")

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientProfile',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    dateBooking: { type: String, required: true },  // ví dụ: "2025-09-28"
    timeBooking: { type: String, required: true },  // ví dụ: "09:00 - 09:30"
    description: { type: String },                  // triệu chứng
    isSentForms: { type: Boolean, default: false }, // đã gửi form chưa
    isTakeCare: { type: Boolean, default: false },  // đang được chăm sóc sau khám chưa
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    strict: true
});

appointmentSchema.post('findOneAndUpdate', async function (doc) {
  try {
    if (!doc) return;

    const date = moment(doc.dateBooking).format("DD/MM/YYYY");
    const time = doc.timeBooking.replace(/\s/g, "");
    const schedule = await Schedule.findOne({
      doctorId: doc.doctorId,
      date,
      time
    });

    if (!schedule) {
      console.warn("⚠️ Không tìm thấy Schedule tương ứng để cập nhật.");
      return;
    }

    if (doc.status === "confirmed") {
      schedule.isBooked = true;
      schedule.sumBooking = Math.min(schedule.sumBooking + 1, schedule.maxBooking);

      await mongoose.model("Appointment").updateMany(
        {
          _id: { $ne: doc._id },
          doctorId: doc.doctorId,
          dateBooking: doc.dateBooking,
          timeBooking: doc.timeBooking,
          status: "pending",
          isDeleted: false
        },
        { $set: { status: "cancelled" } }
      );

      console.log("Đã hủy tất cả appointment pending cùng khung giờ");
    } 
    else if (["cancelled", "completed"].includes(doc.status)) {
      schedule.sumBooking = Math.max(schedule.sumBooking - 1, 0);
      if (schedule.sumBooking < schedule.maxBooking) {
        schedule.isBooked = false;
      }
    }

    await schedule.save();
    console.log(`Đã cập nhật Schedule (${schedule._id}) theo status: ${doc.status}`);

  } catch (err) {
    console.error("Lỗi cập nhật Schedule:", err.message);
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');

