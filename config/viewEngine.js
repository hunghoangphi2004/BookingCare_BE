const express = require("express")

let configViewEngine = (app) => {
    app.use(express.static(`${__dirname}/public`));
    app.set("view engine", "ejs");
    app.set("views", `${__dirname}/views`)
}

module.exports = configViewEngine