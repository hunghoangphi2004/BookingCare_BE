/**
 * @swagger
 * tags:
 *   name: Home
 *   description: API hiển thị dữ liệu trang chủ (chuyên khoa, phòng khám, bác sĩ)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Lấy dữ liệu trang chủ (HomePage)
 *     tags: [Home]
 *     description: |
 *       API trả về danh sách **chuyên khoa**, **phòng khám**, và **bác sĩ đang hoạt động**.
 *       Dữ liệu này được dùng để hiển thị trên trang chủ của hệ thống.
 *     responses:
 *       200:
 *         description: Lấy dữ liệu trang chủ thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               specializations:
 *                 - _id: "6711b2a33fd456aaf24e1234"
 *                   name: "Tim mạch"
 *                   description: "Khám và điều trị bệnh tim mạch"
 *                   image: "https://res.cloudinary.com/demo/image/upload/v1/specializations/heart.png"
 *                   slug: "tim-mach"
 *               clinics:
 *                 - _id: "6711b4b93fd456aaf24e5678"
 *                   name: "Phòng khám An Tâm"
 *                   address: "123 Lê Lợi, Q.1, TP.HCM"
 *                   openingHours: "07:30 - 17:00"
 *                   phone: "0281234567"
 *                   description: "Phòng khám đa khoa uy tín"
 *                   image: "https://res.cloudinary.com/demo/image/upload/v1/clinics/antam.png"
 *                   slug: "phong-kham-an-tam"
 *               doctors:
 *                 - _id: "6711c2b33fd456aaf24e9999"
 *                   name: "BS. Nguyễn Văn A"
 *                   thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/doctors/bs-nguyen-van-a.jpg"
 *                   experience: "10 năm"
 *                   consultationFee: 300000
 *                   slug: "bs-nguyen-van-a"
 *                   clinicId:
 *                     _id: "6711b4b93fd456aaf24e5678"
 *                     name: "Phòng khám An Tâm"
 *                     address: "123 Lê Lợi, Q.1, TP.HCM"
 *                   specializationId:
 *                     _id: "6711b2a33fd456aaf24e1234"
 *                     name: "Tim mạch"
 *                   userId:
 *                     email: "nguyenvana@example.com"
 *       500:
 *         description: Lỗi server hoặc lỗi truy vấn dữ liệu
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
