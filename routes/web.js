const express = require("express")
const authRoutes = require("./auth.routes")

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send("Hello");
    });

    // mount auth routes
    app.use("/auth", authRoutes);

    return app.use("/", router);
}

module.exports = initWebRoutes;