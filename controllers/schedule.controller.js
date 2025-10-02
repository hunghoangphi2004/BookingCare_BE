const scheduleService = require("../services/schedule.service");
const Doctor_user = require("../models/doctor.model")
const Schedule = require("../models/schedule.model")
const PatientProfile = require("../models/patient.model");
const Appointment = require("../models/appointment.model")
const User = require("../models/user.model")

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
    const doctor = await Doctor_user.findOne({ userId: req.user.id, isDeleted: false });
    if (!doctor) return res.status(404).json({ message: "Không tìm thấy hồ sơ bác sĩ", success: false });

    const appointments = await Appointment.find({ 
      doctorId: doctor._id, 
      status: { $ne: "cancelled" } 
    }).sort({ dateBooking: 1, timeBooking: 1 });

    const scheduleWithPatients = [];

    for (const app of appointments) {
      let patient = await PatientProfile.findById(app.patientId);
      let patientData = null;

      if (patient) {
        patientData = {
          firstName: patient.firstName || "",
          lastName: patient.lastName || "",
          phoneNumber: patient.phoneNumber || "",
          patientId: patient.patientId
        };
      } else {
        // Nếu chưa có profile, lấy email từ User
        const user = await User.findById(app.patientId);
        if (user) {
          patientData = { email: user.email };
        }
      }

      if (!patientData) continue;

      // Gộp theo ngày và ca
      let schedule = scheduleWithPatients.find(s => s.dateBooking === app.dateBooking && s.timeBooking === app.timeBooking);
      if (!schedule) {
        schedule = { dateBooking: app.dateBooking, timeBooking: app.timeBooking, patients: [] };
        scheduleWithPatients.push(schedule);
      }

      schedule.patients.push(patientData);
    }

    return res.status(200).json({
      success: true,
      doctor: { id: doctor._id, name: doctor.name },
      scheduleWithPatients
    });

  } catch (err) {
    next(err);
  }
};