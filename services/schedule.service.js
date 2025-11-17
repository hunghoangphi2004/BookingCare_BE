const moment = require("moment");
const Doctor = require("../models/doctor.model");
const Schedule = require("../models/schedule.model"); // cần tạo model Schedule
const AppError = require("../utils/appError.util");

module.exports.createAllDoctorsSchedule = async () => {
  try {
    // Các khung giờ mặc định
    const timeArr = [
      "08:00-08:30",
      "08:30-09:00",
      "09:00-09:30",
      "09:30-10:00",
      "10:00-10:30",
      "10:30-11:00",
      "11:00-11:30",
      "11:30-12:00",
      "13:00-13:30",
      "13:30-14:00",
      "14:00-14:30",
      "14:30-15:00",
      "15:00-15:30",
      "15:30-16:00",
      "16:00-16:30",
      "16:30-17:00",
    ];

    // 3 ngày tới
    const threeDaySchedules = [];
    for (let i = 0; i < 3; i++) {
      let date = moment(new Date())
        .add(i, "days")
        .format("DD/MM/YYYY");
      threeDaySchedules.push(date);
    }

    // Lấy tất cả bác sĩ
    const doctors = await Doctor.find().select("_id");
    if (!doctors || doctors.length === 0) {
      throw new AppError("Không có bác sĩ nào trong hệ thống", 404);
    }

    // Kiểm tra đã tạo lịch trước đó chưa (check bác sĩ đầu tiên, ngày đầu tiên, ca đầu tiên)
    const check = await Schedule.findOne({
      doctorId: doctors[0]._id,
      date: threeDaySchedules[0],
      time: timeArr[0],
    });

    if (check) {
      return "Lịch đã được tạo trước đó, không tạo trùng.";
    }

    // Tạo lịch cho tất cả bác sĩ
    let bulkSchedules = [];
    doctors.forEach((doctor) => {
      threeDaySchedules.forEach((day) => {
        timeArr.forEach((time) => {
          bulkSchedules.push({
            doctorId: doctor._id,
            date: day,
            time: time,
            maxBooking: 1,
            sumBooking: 0,
          });
        });
      });
    });

    await Schedule.insertMany(bulkSchedules);

    return "Đã tạo lịch khám cho tất cả bác sĩ trong 3 ngày tới.";
  } catch (err) {
    throw err;
  }
};
module.exports.getSchedulesByDoctorAndDate = async (slug, date) => {
  const formattedDate = moment(date, ["DD-MM-YYYY", "DD/MM/YYYY"]).format("DD/MM/YYYY");
  const doctor = await Doctor.findOne({ slug});
  if (!doctor) throw new AppError("Không tìm thấy bác sĩ với slug này", 404);

  const schedules = await Schedule.find({
    doctorId: doctor._id,
    date: formattedDate,
    isBooked: false
  })
    .sort({ time: 1 })
    .lean();

  return {
    doctor: {
      id: doctor._id,
      name: doctor.name,
      slug: doctor.slug,
    },
    date: formattedDate,
    schedules: schedules.map((s) => ({
      _id: s._id,
      time: s.time,
      maxBooking: s.maxBooking,
      sumBooking: s.sumBooking,
    })),
  };
};

module.exports.createSingleSchedule = async (body) => {
  const { doctorId, date, schedules } = body;
  console.log(doctorId, date)
  let doctorSchedules = [];
  for (const item of schedules) {
    let newSchedule = new Schedule()
    newSchedule.doctorId = doctorId;
    newSchedule.date = date;
    newSchedule.time = item.time
    doctorSchedules.push(newSchedule)
    await newSchedule.save();
  }
  return doctorSchedules
}
