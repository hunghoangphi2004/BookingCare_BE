const express = require("express");
const authRoutes = require("./auth.routes");
const doctorRoutes = require("./docter.routes");
const clinicRoutes = require("./clinic.routes");
const homeRoutes = require("./home.routes");
const specializationRoutes = require("./specialization.routes");

let router = express.Router();

let initWebRoutes = (app) => {
  app.use("/auth", authRoutes);
  app.use("/doctor", doctorRoutes);
  app.use("/clinic", clinicRoutes);
  app.use("/specialization", specializationRoutes);
  app.use("/home", homeRoutes);

  return app.use("/", router);
};

module.exports = initWebRoutes;
