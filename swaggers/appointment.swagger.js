/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: API quản lý lịch hẹn khám bệnh
 */

/**
 * @swagger
 * /appointment/create:
 *   post:
 *     summary: Bệnh nhân đặt lịch hẹn khám
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - dateBooking
 *               - timeBooking
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: ID của bác sĩ muốn đặt lịch
 *                 example: "66f2b2e8a0d7d95b7d1a39e3"
 *               dateBooking:
 *                 type: string
 *                 description: Ngày đặt lịch (định dạng YYYY-MM-DD)
 *                 example: "2025-09-28"
 *               timeBooking:
 *                 type: string
 *                 description: Thời gian đặt lịch (VD '09:00 - 09:30')
 *                 example: "09:00 - 09:30"
 *               description:
 *                 type: string
 *                 description: Triệu chứng / mô tả bệnh
 *                 example: "Đau đầu, chóng mặt nhẹ"
 *     responses:
 *       201:
 *         description: Đặt lịch thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Đặt lịch thành công"
 *               data:
 *                 _id: "66f39c4b2e4d23a5f7c912f1"
 *                 doctorId: "66f2b2e8a0d7d95b7d1a39e3"
 *                 patientId: "66f2b5caa0d7d95b7d1a49f5"
 *                 dateBooking: "2025-09-28"
 *                 timeBooking: "09:00 - 09:30"
 *                 status: "pending"
 *       400:
 *         description: Thiếu thông tin hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy bác sĩ hoặc hồ sơ bệnh nhân
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /appointment/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả lịch hẹn (Admin & Supporter)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách các lịch hẹn
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Tất cả lịch đặt"
 *               data:
 *                 - _id: "66f3a5d3d94d5a2b8f9e2b91"
 *                   doctorId: "66f2b2e8a0d7d95b7d1a39e3"
 *                   patientId: "66f2b5caa0d7d95b7d1a49f5"
 *                   dateBooking: "2025-09-28"
 *                   timeBooking: "09:00 - 09:30"
 *                   status: "pending"
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /appointment/change-status/{id}/{status}:
 *   post:
 *     summary: Supporter thay đổi trạng thái lịch hẹn (pending → confirmed/completed/cancelled)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của lịch hẹn
 *         schema:
 *           type: string
 *           example: "66f39c4b2e4d23a5f7c912f1"
 *       - name: status
 *         in: path
 *         required: true
 *         description: Trạng thái mới của lịch hẹn (`pending`, `confirmed`, `completed`, `cancelled`)
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *           example: confirmed
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Thay đổi trạng thái cuộc hẹn thành công"
 *       400:
 *         description: Thông tin không hợp lệ
 *       404:
 *         description: Không tìm thấy lịch hẹn
 *       500:
 *         description: Lỗi server
 */
