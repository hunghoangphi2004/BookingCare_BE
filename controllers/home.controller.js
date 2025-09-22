const homeService = require("../services/home.service");
const mongoose = require("mongoose");

module.exports.getHomePage = async (req, res, next) => {
  try {
    let specializations = await homeService.getAllSpecialization();
    let clinics = await homeService.getAllClinic();
    let doctors = await homeService.getActiveDoctors();
    return res.status(200).json({
      success: true,
      specializations: specializations,
      clinics: clinics,
      doctors: doctors,
    });
  } catch (err) {
    next(err);
  }
};
