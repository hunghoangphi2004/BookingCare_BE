// routes/home.routes.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Trang chủ
 */

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Lấy dữ liệu trang chủ
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/", homeController.getHomePage);

module.exports = router;
