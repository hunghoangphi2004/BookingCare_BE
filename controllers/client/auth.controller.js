const User = require('../../models/user.model.js')
const Patient = require("../../models/patient.model.js")
const OTP = require('../../models/otp.model.js')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const validator = require('validator')
const nodemailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const fs = require("fs");
const { uploadToCloudinary } = require('../../utils/cloudinary.util.js')
const Doctor = require("../../models/doctor.model.js")
const Supporter = require("../../models/supporter.model.js")
const patientService = require('../../services/patient.service.js')

module.exports.getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, role } = req.query;

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);
        const skip = (page - 1) * limit;

        // build filter
        const filter = { isDeleted: false };
        if (role) filter.role = role;

        // get users
        const users = await User.find(filter)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        // total count
        const total = await User.countDocuments(filter);

        // attach roleData
        const result = [];
        for (const user of users) {
            let roleData = null;
            switch (user.role) {
                case "doctor":
                    roleData = await Doctor.findOne({ userId: user._id.toString() }).lean();
                    break;
                case "supporter":
                    roleData = await Supporter.findOne({ userId: user._id.toString() }).lean();
                    break;
                case "patient":
                    roleData = await Patient.findOne({ userId: user._id.toString() }).lean();
                    break;
            }
            result.push({ ...user, roleData });
        }

        res.status(200).json({
            data: result,
            pagination: {
                total,
                page,
                limit,
                totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
            },
            success: true,
        });
    } catch (err) {
        console.error("Error in getAllUsers:", err);
        res.status(500).json({
            data: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
            success: false,
            message: err.message || "Có lỗi xảy ra khi lấy danh sách người dùng",
        });
    }
};


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
            if (err) {
                console.error("Send mail error:", err);
                return res.status(500).json({ message: "Email send failed", error: err, success: false });
            } else {
                console.log("Email sent:", info.response);
            }
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
        console.log(req.body)
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

        // 2️⃣ Tạo patient profile liên kết user
        const newPatient = new Patient({
            userId: newUser._id,
        });
        await newPatient.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            Patient: newPatient,
            success: true
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "error in register - controllers/user.js",
            error: error.message,
            success: false
        });
    }
};


module.exports.login = async (req, res) => {
    try {
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
        if (existingUser.role !== "patient") {
            return res.status(400).json({ message: 'Vui lòng đăng nhập bằng tài khoản bệnh nhân', success: false });
        } else {
            const patient = await Patient.findOne({ userId: existingUser._id }).select("-__v");
            responseData.patient = patient || null;
        }


        res.cookie("tokenUser", existingUser.token, {
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


module.exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(401).json({ message: "Missing refresh token", success: false });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại", success: false });
        }

        const newAccessToken = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            message: "Access token refreshed successfully",
        });
    } catch (err) {
        console.error("refreshToken error:", err.message);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token",
            error: err.message,
        });
    }
};


module.exports.sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const isEmailAlreadyReg = await User.findOne({ email })

        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
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


module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.status(200).json({
        message: 'logout successfully',
        success: true
    });
}


module.exports.getProfile = async (req, res) => {
    try {
        console.log(req.user.id)
        const user = await User.findById(req.user.id).select("email role avatar");
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }
        if (user.role == "patient") {
            const patient = await Patient.findOne({ userId: user._id });
            return res.status(200).json({
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                patient
            });
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

module.exports.changeAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
        }

        // Upload lên Cloudinary
        const result = await uploadToCloudinary(req.file.path, "avatars");
        const imageUrl = result.secure_url;

        // Xóa file tạm
        fs.unlinkSync(req.file.path);

        // Update avatar user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: imageUrl },
            { new: true }
        ).select("email role avatar");

        res.status(200).json({
            success: true,
            message: "Cập nhật avatar thành công",
            user
        });
    } catch (err) {
        next(err);
    }
};

module.exports.editProfile = async (req, res, next) => {
    console.log(req.user.id)
    console.log(req.body)
    try {
        // Lấy body từ multipart/form-data
        const {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
            emergencyContact
        } = req.body;

        let imageUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.path, "patients");
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path); // xóa sau khi upload
        }

        const updatedData = {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
            thumbnail: imageUrl || undefined, // chỉ lấy 1 lần
            emergencyContact: {
                name: emergencyContact?.name || req.body["emergencyContact[name]"] || "",
                phone: emergencyContact?.phone || req.body["emergencyContact[phone]"] || "",
                relationship: emergencyContact?.relationship || req.body["emergencyContact[relationship]"] || "",
            }
        };


        // Lấy patient
        const patient = await Patient.findOne({ userId: req.user.id });
        if (!patient) return res.status(404).json({ message: "Patient not found", success: false });

        // Cập nhật
        const updatedPatient = await patientService.editPatient(patient._id, updatedData);

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin cá nhân thành công",
            patient: updatedPatient,
        });
    } catch (err) {
        next(err);
    }
};
