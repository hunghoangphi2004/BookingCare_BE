const express = require("express")
const authRoutes = require("./auth.routes")
const doctorRoutes = require("./docter.routes")
const clinicRoutes = require("./clinic.routes")
const homeRoutes = require("./home.routes")
const specializationRoutes = require("./specialization.routes")
const appointmentRoutes = require("./appointment.routes")
const scheduleRoutes = require("./schedule.routes")
const supporterRoutes = require("./supporter.routes")

let router = express.Router();

let initWebRoutes = (app) => {
    app.use("/auth", authRoutes);
    app.use("/doctor", doctorRoutes)
    app.use("/clinic", clinicRoutes)
    app.use("/specialization", specializationRoutes )
    app.use("/", homeRoutes)
    app.use("/appointment", appointmentRoutes)
    app.use("/schedule", scheduleRoutes)
    app.use("/supporter", supporterRoutes)

    return app.use("/", router);
}

module.exports = initWebRoutes;