const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"BookingSystem" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email đã gửi tới ${to}`);
  } catch (err) {
    console.error("❌ Gửi email thất bại:", err);
  }
};
