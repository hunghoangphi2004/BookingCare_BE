const scheduleService = require("../../services/schedule.service");
const Doctor = require("../../models/doctor.model")
const Schedule = require("../../models/schedule.model")
const Patient = require("../../models/patient.model");
const Appointment = require("../../models/appointment.model")
const User = require("../../models/user.model")
// const scheduleService = require("../services/schedule.service")

module.exports.createAllSchedules = async (req, res, next) => {
  try {
    const msg = await scheduleService.createAllDoctorsSchedule();
    return res.status(201).json({
      success: true,
      message: msg,
    });
  } catch (err) {
    next(err);
  }
};


module.exports.getMyAppointmentsByDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ bác sĩ"
      });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đã bị khoá hoặc không tồn tại"
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      status: "confirmed"
    }).sort({ dateBooking: 1, timeBooking: 1 });

    const scheduleWithPatients = [];

    for (const app of appointments) {
      const patient = await Patient.findById(app.patientId);
      let patientData = null;

      if (patient) {
        patientData = {
          firstName: patient.firstName || "",
          lastName: patient.lastName || "",
          phoneNumber: patient.phoneNumber || "",
          patientId: patient.patientId
        };
      } else {
        const userPatient = await User.findById(app.patientId);
        if (userPatient) {
          patientData = { email: userPatient.email };
        }
      }

      if (!patientData) continue;

      let schedule = scheduleWithPatients.find(
        s => s.dateBooking === app.dateBooking && s.timeBooking === app.timeBooking
      );

      if (!schedule) {
        schedule = { dateBooking: app.dateBooking, timeBooking: app.timeBooking, patients: [] };
        scheduleWithPatients.push(schedule);
      }

      schedule.patients.push(patientData);
    }

    return res.status(200).json({
      success: true,
      doctor: { id: doctor._id, name: doctor.name, thumbnail: doctor.thumbnail },
      scheduleWithPatients
    });

  } catch (err) {
    next(err);
  }
};


module.exports.createSchedule = async (req, res, next) => {
  try {
    const data = await scheduleService.createSingleSchedule(req.body)

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    next(err);
  }
};