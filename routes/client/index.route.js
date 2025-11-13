const authRoutes = require("./auth.routes.js")
const homeRoutes = require("./home.routes.js")
const appointmentRoutes = require("./appointment.routes.js")
const scheduleRoutes = require("./schedules.routes.js")
const familyRoutes = require("./family.route.js")
const authMiddleware = require("../../middlewares/client/auth.middleware.js")

module.exports = (app) => {
    app.use("/auth", authRoutes);
    app.use("/home", homeRoutes);
    app.use("/appointments", authMiddleware.requireAuth, appointmentRoutes);
    app.use("/schedules", scheduleRoutes);
    app.use("/families", authMiddleware.requireAuth, familyRoutes);
}