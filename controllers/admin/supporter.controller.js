const mongoose = require('mongoose');
const supporterService = require("../../services/supporter.service")
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util')

module.exports.getAllSupporter = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, ...filters } = req.query;
    const result = await supporterService.getAllSupporter(filters, parseInt(page), parseInt(limit));
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports.createSupporter = async (req, res, next) => {
    try {
        let imageUrl = null;

        if (req.file) {
            // Upload lên Cloudinary
            const result = await uploadToCloudinary(
                req.file.path,
                "supporters"
            );
            imageUrl = result.secure_url;

            // Xóa file tạm
            fs.unlinkSync(req.file.path);
        }

        const { newUser, newSupporter } = await supporterService.createSupporter({ ...req.body, thumbnail: imageUrl })
        return res.status(201).json({
            success: true,
            message: "Supporter created successfully",
            user: newUser,
            doctor: newSupporter
        });
    } catch (err) {
        next(err)
    }
}

module.exports.approveAppointment = async (req, res, next) => {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
        .populate("doctorId")
        .populate("patientId");

    if (!appointment) return next(new AppError("Không tìm thấy lịch hẹn", 404));

    appointment.status = "confirmed";
    await appointment.save();

    await sendEmail(
        appointment.patientId.email,
        "Lịch khám của bạn đã được xác nhận",
        `<p>Xin chào ${appointment.patientId.firstName},</p>
     <p>Lịch khám của bạn đã được xác nhận thành công:</p>
     <ul>
       <li><b>Bác sĩ:</b> ${appointment.doctorId.fullName}</li>
       <li><b>Ngày:</b> ${appointment.dateBooking}</li>
       <li><b>Giờ:</b> ${appointment.timeBooking}</li>
     </ul>
     <p>Vui lòng đến đúng giờ. Cảm ơn bạn đã sử dụng dịch vụ.</p>`
    );

    res.status(200).json({
        success: true,
        message: "Đã xác nhận lịch khám và gửi email cho bệnh nhân.",
    });
};

module.exports.editSupporter = async (req, res, next) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "supporters");
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedSupporter = await supporterService.editSupporter(
      req.params.id,
      { ...req.body, thumbnail: imageUrl },
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin hỗ trợ viên thành công",
      supporter: updatedSupporter,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSupporter = async (req, res, next) => {
  try {
    const result = await supporterService.deleteSupporter(req.params.id,req.user.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const result = await supporterService.changeStatus(req.params.id, req.params.status);
    console.log(req.params.id,req.params.status)
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra",
      Error: err.message,
    });
  }
};

module.exports.getSupporterById = async (req, res, next) => {
  try {
    const record = await supporterService.getSupporterById(req.params.id);
    return res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
