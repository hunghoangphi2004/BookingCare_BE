const User = require('../models/user.model.js')
const OTP = require('../models/otp.model.js')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const validator = require('validator')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')

module.exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.find()

        res.status(200).json({ result, message: 'all users get successfully', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'error in getAllUsers - controllers/user.js', error, success: false })
    }
}

module.exports.sendRegisterOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const isEmailAlreadyReg = await User.findOne({ email })
        // in register user should not be registered already
        if (isEmailAlreadyReg) return res.status(400).json({ message: `user with email ${email} already resgistered `, success: false })


        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const hashedOTP = await bcrypt.hash(otp, 12)
        const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'register_otp' })

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification',
            html: `<p>Your OTP code is ${otp}</p>`
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null        //console.log(info);
        });

        res.status(200).json({ result: newOTP, message: 'register_otp send successfully', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'error in sendRegisterOTP - controllers/user.js', error, success: false })
    }
}

// controllers/auth.controller.js
module.exports.register = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        // Kiểm tra input
        if (!email || !password || !otp) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                success: false 
            });
        }

        // Kiểm tra OTP có tồn tại không
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.status(400).json({ 
                message: "OTP not found or expired", 
                success: false 
            });
        }

        // So sánh OTP
        const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
        if (!isValidOtp) {
            return res.status(400).json({ 
                message: "Invalid OTP", 
                success: false 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            email,
            password: hashedPassword,
            role: "patient",
            isActive: true
        });

        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            success: true
        });
    } catch (error) {
        console.error("Register error:", error);  // 👈 in chi tiết lỗi
        return res.status(500).json({
            message: "error in register - controllers/user.js",
            error: error.message,   // 👈 gửi cả error.message
            success: false
        });
    }
};


module.exports.login = async (req, res) => {
  try {
    const auth_token = 'auth_token';
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'make sure to provide all fields (email, password)',
        success: false
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'email pattern failed. Please provide a valid email.',
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid Credentials', success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid Credentials', success: false });
    }

    // Kiểm tra token đã tồn tại chưa
    const isTokenExist = existingUser.tokens?.some(t => t.name === auth_token);
    if (isTokenExist) {
      return res.status(201).json({
        result: existingUser,
        message: `user with email ${email} already logged in`,
        success: true
      });
    }

    // Tạo token mới
    const token = jwt.sign(
      { email, _id: existingUser._id },
      process.env.JWT_SECRET
    );
    existingUser.tokens.push({ name: auth_token, token });

    // Lưu lại
    const result = await existingUser.save();

    res.status(200).json({ result, message: 'login successfully', success: true });
  } catch (error) {
    res.status(500).json({
      message: 'login failed - controllers/user.js',
      error: error.message,
      success: false
    });
  }
};


module.exports.sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const isEmailAlreadyReg = await User.findOne({ email })

        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
        // in forget password route, user should be registered already
        if (!isEmailAlreadyReg) return res.status(400).json({ message: `no user exist with email ${email}`, success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const hashedOTP = await bcrypt.hash(otp, 12)
        const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'forget_password_otp' })

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification',
            html: `<p>Your OTP code is ${otp}</p>`      // all data to be sent
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null //console.log(info);
        });


        res.status(200).json({ result: newOTP, otp, message: 'forget_password_otp send successfully', success: true })

    }
    catch (error) {
        res.status(404).json({ message: 'error in sendForgetPasswordOTP - controllers/user.js', error, success: false })
    }
}

module.exports.changePassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body
        if (!email || !password || !otp) return res.status(400).json({ message: 'make sure to provide all the fieds ( email, password, otp)', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const findedUser = await User.findOne({ email })
        if (!findedUser) return res.status(400).json({ message: `user with email ${email} is not exist `, success: false })


        const otpHolder = await OTP.find({ email })
        if (otpHolder.length == 0) return res.status(400).json({ message: 'you have entered an expired otp', success: false })

        const forg_pass_otps = otpHolder.filter(otp => otp.name == 'forget_password_otp')         // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
        const findedOTP = forg_pass_otps[forg_pass_otps.length - 1]

        const plainOTP = otp
        const hashedOTP = findedOTP.otp

        const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP)

        if (isValidOTP) {
            const hashedPassword = await bcrypt.hash(password, 12)
            const result = await User.findByIdAndUpdate(findedUser._id, { name: findedUser.name, email, password: hashedPassword }, { new: true })

            await OTP.deleteMany({ email: findedOTP.email })

            return res.status(200).json({ result, message: 'password changed successfully', success: true })
        }
        else {
            return res.status(200).json({ message: 'wrong otp', success: false })
        }

    }
    catch (error) {
        res.status(404).json({ message: 'error in changePassword - controllers/user.js', error, success: false })
    }
}

// export const deleteAllUsers = async (req, res) => {
//     try {

//         const result = await User.deleteMany()
//         res.status(200).json({ result, message: `User collection deleted successfully `, success: true })

//     }
//     catch (err) {
//         res.status(404).json({ message: 'error in deleteAllUsers - controllers/user.js', success: false })
//     }
// }