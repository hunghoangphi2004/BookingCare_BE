const User = require('../../models/user.model.js')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const validator = require('validator')
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util.js')
const Doctor = require("../../models/doctor.model.js")
const Supporter = require("../../models/supporter.model.js")

module.exports.login = async (req, res) => {
    try {
        console.log("dang nhap")
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Thiếu email hoặc password',
                success: false
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Sai định dạng email',
                success: false
            });
        }

        const existingUser = await User.findOne({ email }).select("email role token password");
        if (!existingUser) {
            return res.status(400).json({ message: 'Không tìm thấy tài khoản', success: false });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu', success: false });
        }

        const refreshToken = jwt.sign(
            { _id: existingUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        const responseData = existingUser.toObject();
        if (existingUser.role === "doctor") {
            const doctor = await Doctor.findOne({ userId: existingUser._id }).select("-createdAt -updatedAt -__v -isDeleted");
            responseData.doctor = doctor || null;
        }
        if (existingUser.role === "supporter") {
            const supporter = await Supporter.findOne({ userId: existingUser._id });
            responseData.supporter = supporter || null;
        }

        res.cookie("token", existingUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            result: responseData,
            refreshToken: refreshToken,
            message: 'login successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: 'login failed',
            error: error.message,
            success: false
        });
    }
};

module.exports.logout = async (req, res) => {
    console.log("dang xuat admin")
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
        path: "/"
    });
    res.status(200).json({ message: "logout successfully", success: true });
};

module.exports.getProfile = async (req, res) => {
    try {
        console.log(req.user.id)
        const user = await User.findById(req.user.id).select("email role");
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }
        if (user.role == "doctor") {
            const doctorProfile = await Doctor.findOne({ userId: user._id });
            return res.status(200).json({
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                doctorProfile
            });
        }
        res.json({
            email: user.email,
            role: user.role,
            avatar: user.avatar
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};