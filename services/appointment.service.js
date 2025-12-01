const mongoose = require("mongoose");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const User = require("../models/user.model")
const AppError = require("../utils/appError.util");
const Schedule = require("../models/schedule.model");
const { sendEmail } = require("../utils/email.util");
const moment = require("moment");

module.exports.createAppointment = async (body,id) => {
  const {doctorId, dateBooking, timeBooking, description, images } = body;

  const user = await User.findOne({ _id: id }).select("email");
  const patient = await Patient.findOne({ userId: user._id });


  if (!doctorId) throw new AppError("Thiếu doctorId", 400);
  if (!patient) throw new AppError("Không tìm thấy hồ sơ bệnh nhân", 400);
  if (!dateBooking) throw new AppError("Thiếu ngày đặt lịch", 400);
  if (!timeBooking) throw new AppError("Thiếu giờ đặt lịch", 400);

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new AppError("doctorId không hợp lệ", 400);
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError("Không tìm thấy bác sĩ", 404);
  }

  const confirmedCount = await Appointment.countDocuments({
    doctorId,
    dateBooking,
    timeBooking,
    status: "confirmed",
  });
  if (confirmedCount >= 1) {
    throw new AppError("Khung giờ này đã có bệnh nhân khác được xác nhận", 400);
  }


  const pendingCount = await Appointment.countDocuments({
    patientId: patient.id,
    doctorId,
    dateBooking,
    timeBooking,
    status: "pending",
  });

  if (pendingCount >= 1) {
    throw new AppError("Bạn đã đặt khung giờ này rồi, vui lòng chờ xác nhận từ hệ thống", 400);
  }



  const newAppointment = new Appointment({
    doctorId,
    patientId: patient._id,
    dateBooking,
    timeBooking,
    description,
    status: "pending",
    images
  });

  await newAppointment.save();

  const normalizedTime = timeBooking.replace(/\s/g, "");
  const schedule = await Schedule.findOne({
    doctorId,
    date: moment(dateBooking).format("DD/MM/YYYY"),
    time: normalizedTime,
  });

  if (!schedule) throw new AppError("Schedule không tồn tại", 404);

  schedule.sumBooking += 1;
  await schedule.save();

  console.log("Gửi mail cho:", user.email);
  if (user?.email) {
    await sendEmail(
      user.email,
      "Yêu cầu đặt lịch của bạn đã được ghi nhận",
      `<p>Xin chào ${patient.firstName},</p>
       <p>Yêu cầu đặt lịch khám của bạn với bác sĩ <b>${doctor.name}</b> đã được ghi nhận.</p>
       <p>Hỗ trợ viên của chúng tôi sẽ xem xét và gửi xác nhận sớm nhất qua email.</p>
       <p>Vui lòng để ý hộp thư để biết kết quả đặt lịch.</p>`
    );
  }

  return newAppointment;
};

module.exports.getAllAppointment = async () => {
  const appointment = await Appointment.find({ isDeleted: false, status: "pending" });
  return appointment;
}

module.exports.getAllAppointmentByUser = async (userId) => {
  const patient = await Patient.findOne({ userId });
  if (!patient) throw new AppError("Không tìm thấy hồ sơ bệnh nhân", 404);
  const appointment = await Appointment.find({ patientId: patient._id, isDeleted: false}).populate("doctorId").sort({ createdAt: -1 });
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

  if (status === "confirmed") {
    const patient = await Patient.findById(appointment.patientId).populate("userId");
    const user = await User.findById(patient.userId);

    const doctor = await Doctor.findById(appointment.doctorId);

    if (user?.email && doctor) {
      const email = user.email;
      const doctorName = doctor.name;
      const date = moment(appointment.dateBooking).format("DD/MM/YYYY");
      const time = appointment.timeBooking;

      await sendEmail(
        email,
        "Lịch hẹn của bạn đã được xác nhận ✅",
        `<p>Xin chào ${patient.firstName},</p>
         <p>Cuộc hẹn của bạn với bác sĩ <b>${doctorName}</b> đã được <b>xác nhận</b>.</p>
         <p><b>Thời gian:</b> ${time}, ngày ${date}</p>
         <p>Vui lòng đến đúng giờ hoặc liên hệ nếu cần thay đổi.</p>
         <br/>
         <p>Trân trọng,<br/>Phòng khám của chúng tôi.</p>`
      );
    }
  }

  return appointment;
};