const express = require("express");
const authRoutes = require("./auth.routes");
const doctorRoutes = require("./docter.routes");
const clinicRoutes = require("./clinic.routes");
const homeRoutes = require("./home.routes");
const specializationRoutes = require("./specialization.routes");
const appointmentRoutes = require("./appointment.routes");
const scheduleRoutes = require("./schedule.routes");
const supporterRoutes = require("./supporter.routes");
const patientRoutes = require("./patient.routes");

let router = express.Router();

let initWebRoutes = (app) => {
  app.use("/auth", authRoutes);
  app.use("/doctors", doctorRoutes);
  app.use("/clinics", clinicRoutes);
  app.use("/specializations", specializationRoutes);
  app.use("/", homeRoutes);
  app.use("/appointment", appointmentRoutes);
  app.use("/schedule", scheduleRoutes);
  app.use("/supporter", supporterRoutes);
  app.use("/patient", patientRoutes);

  return app.use("/", router);
};

module.exports = initWebRoutes;
