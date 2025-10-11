const mongoose = require("mongoose");
const PatientProfile = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Doctor_user = require("../models/doctor.model");
const AppError = require("../utils/appError.util");
const Schedule = require("../models/schedule.model");
const { sendEmail } = require("../utils/email.util");
const moment = require("moment");

module.exports.createAppointment = async (body, user) => {
  const { doctorId, dateBooking, timeBooking, description } = body;

  // 🔹 Tìm hồ sơ bệnh nhân bằng userId từ token
  const patient = await PatientProfile.findOne({ userId: user._id || user.id });

  if (!doctorId) throw new AppError("Thiếu doctorId", 400);
  if (!patient) throw new AppError("Không tìm thấy hồ sơ bệnh nhân", 400);
  if (!dateBooking) throw new AppError("Thiếu ngày đặt lịch", 400);
  if (!timeBooking) throw new AppError("Thiếu giờ đặt lịch", 400);

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new AppError("doctorId không hợp lệ", 400);
  }

  // 2️⃣ Kiểm tra bác sĩ tồn tại
  const doctor = await Doctor_user.findById(doctorId);
  if (!doctor || doctor.isDeleted) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  // 3️⃣ Kiểm tra trùng khung giờ
  const confirmedCount = await Appointment.countDocuments({
    doctorId,
    dateBooking,
    timeBooking,
    status: "confirmed",
  });

  if (confirmedCount >= 1) {
    throw new AppError("Khung giờ này đã có bệnh nhân khác được xác nhận", 400);
  }

  // 4️⃣ Tạo lịch hẹn
  const newAppointment = new Appointment({
    doctorId,
    patientId: patient._id,
    dateBooking,
    timeBooking,
    description,
    status: "pending",
  });

  await newAppointment.save();

  // 5️⃣ Cập nhật schedule
  const normalizedTime = timeBooking.replace(/\s/g, "");
  const schedule = await Schedule.findOne({
    doctorId,
    date: moment(dateBooking).format("DD/MM/YYYY"),
    time: normalizedTime,
  });

  if (!schedule) throw new AppError("Schedule không tồn tại", 404);

  schedule.sumBooking += 1;
  await schedule.save();

  // 6️⃣ Gửi mail thông báo
  console.log("📩 Gửi mail cho:", user.email);
  if (user?.email) {
    await sendEmail(
      user.email,
      "Yêu cầu đặt lịch của bạn đã được ghi nhận",
      `<p>Xin chào ${patient.firstName},</p>
       <p>Yêu cầu đặt lịch khám của bạn với bác sĩ <b>${doctor.name}</b> đã được ghi nhận.</p>
       <p>Supporter của chúng tôi sẽ xem xét và gửi xác nhận sớm nhất qua email.</p>
       <p>Vui lòng để ý hộp thư để biết kết quả đặt lịch.</p>`
    );
  }

  return newAppointment;
};

module.exports.getAllAppointment = async () => {
  const appointment = await Appointment.find({ isDeleted: false, status: "pending" });
  return appointment;
}

module.exports.changeStatusAppointment = async (id, status) => {
  if (!id) throw new AppError("Thiếu id appointment", 400);
  if (!status) throw new AppError("Thiếu status appointment", 400);

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError("status không hợp lệ", 400);
  }

   const appointment = await Appointment.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { status },
    { new: true, runValidators: true }
  );

  if (!appointment) {
    throw new AppError("Không tìm thấy lịch hẹn", 404);
  }

  return appointment;
};
