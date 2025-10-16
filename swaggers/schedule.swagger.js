/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: API quản lý lịch làm việc và lịch hẹn bác sĩ
 */

/**
 * @swagger
 * /schedule/create-all:
 *   post:
 *     summary: Tạo lịch khám cho tất cả bác sĩ trong 3 ngày tới
 *     tags: [Schedule]
 *     security:
 *       - BearerAuth: []
 *     description: Chỉ admin mới có quyền tạo lịch làm việc mặc định cho tất cả bác sĩ (3 ngày kế tiếp, mỗi ngày nhiều ca).
 *     responses:
 *       201:
 *         description: Tạo lịch thành công hoặc đã tồn tại
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Đã tạo lịch khám cho tất cả bác sĩ trong 3 ngày tới."
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /schedule/my-schedule:
 *   get:
 *     summary: Lấy danh sách lịch hẹn của bác sĩ hiện tại
 *     tags: [Schedule]
 *     security:
 *       - BearerAuth: []
 *     description: Bác sĩ đăng nhập có thể xem danh sách lịch hẹn của mình, bao gồm thông tin bệnh nhân và thời gian.
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách lịch hẹn
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               doctor:
 *                 id: "6710a1e32fd456aaf24e1234"
 *                 name: "BS. Nguyễn Văn A"
 *               scheduleWithPatients:
 *                 - dateBooking: "2025-10-17"
 *                   timeBooking: "09:00-09:30"
 *                   patients:
 *                     - firstName: "Thăng"
 *                       lastName: "Nguyễn"
 *                       phoneNumber: "0901234567"
 *                       patientId: "BN123ABC"
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy hồ sơ bác sĩ
 */

/**
 * @swagger
 * /schedule/doctor/{slug}/date/{date}:
 *   get:
 *     summary: Lấy lịch trống của bác sĩ theo slug và ngày
 *     tags: [Schedule]
 *     description: Trả về danh sách các khung giờ còn trống của bác sĩ trong ngày chỉ định.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của bác sĩ (ví dụ bac-si-nguyen-van-a)
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "17-10-2025"
 *         description: Ngày cần xem lịch (định dạng DD-MM-YYYY hoặc DD/MM/YYYY)
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách lịch trống
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               doctor:
 *                 id: "6710a1e32fd456aaf24e1234"
 *                 name: "BS. Nguyễn Văn A"
 *                 slug: "bac-si-nguyen-van-a"
 *               date: "17/10/2025"
 *               schedules:
 *                 - _id: "6710a2b63fd456aaf24e5678"
 *                   time: "08:00-08:30"
 *                   maxBooking: 1
 *                   sumBooking: 0
 *       404:
 *         description: Không tìm thấy bác sĩ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /schedule/create-schedule:
 *   post:
 *     summary: Tạo lịch làm việc cho một bác sĩ
 *     tags: [Schedule]
 *     description: Tạo nhiều khung giờ làm việc cho 1 bác sĩ trong ngày chỉ định.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: ID của bác sĩ
 *                 example: "6710a1e32fd456aaf24e1234"
 *               date:
 *                 type: string
 *                 description: Ngày làm việc (định dạng DD/MM/YYYY)
 *                 example: "18/10/2025"
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "09:00-09:30"
 *     responses:
 *       200:
 *         description: Tạo thành công các khung giờ cho bác sĩ
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - doctorId: "6710a1e32fd456aaf24e1234"
 *                   date: "18/10/2025"
 *                   time: "09:00-09:30"
 *                   maxBooking: 1
 *                   sumBooking: 0
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
