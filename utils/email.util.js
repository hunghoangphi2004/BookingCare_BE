const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, html, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"BookingSystem" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log(`📧 Email đã gửi tới ${to}`);
    return true;
  } catch (err) {
    console.error("❌ Gửi email thất bại:", err);
    // throw so caller can handle failures
    throw err;
  }
};
