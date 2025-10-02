const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor_user", required: true },
    date: { type: String, required: true }, // lưu dạng DD/MM/YYYY
    time: { type: String, required: true }, // khung giờ
    maxBooking: { type: Number, default: 1 }, // tối đa số bệnh nhân
    sumBooking: { type: Number, default: 0 }, // số đã đặt
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema,'schedules');
