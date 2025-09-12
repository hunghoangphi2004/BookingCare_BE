const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

// utils/otp.js
const otpStore = {}; // <-- phải có dòng này

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
}

async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending OTP email:', err);
                return reject(err);
            }
            console.log('OTP email sent:', info.response);
            resolve(info);
        });
    });
}


module.exports = { generateOTP, sendOTP, otpStore };
