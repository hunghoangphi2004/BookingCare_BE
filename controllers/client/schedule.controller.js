const scheduleService = require("../../services/schedule.service");

module.exports.getSchedulesByDoctorAndDate = async (req, res, next) => {
  try {
    const { slug, date } = req.params;
    const data = await scheduleService.getSchedulesByDoctorAndDate(slug, date);

    return res.status(200).json({
      success: true,
      doctor: data.doctor,
      date: data.date,
      schedules: data.schedules,
    });
  } catch (err) {
    next(err);
  }
};
