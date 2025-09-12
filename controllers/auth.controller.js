// controllers/auth.controller.js
const User = require('../models/user.model');
const DoctorProfile = require('../models/doctor.model');
const PatientProfile = require('../models/patient.model');
const validator = require('validator');

class AuthController {
    // Đăng ký bệnh nhân (public)
    static async registerPatient(req, res) {
        try {
            const { email, password, profile } = req.body;

            // Validation
            if (!email || !password || !profile) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    error: 'Email, password and profile are required'
                });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                    error: 'Please provide valid email'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password too short',
                    error: 'Password must be at least 6 characters'
                });
            }

            // Validate patient profile
            const { firstName, lastName, phoneNumber } = profile;
            if (!firstName || !lastName || !phoneNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing patient information',
                    error: 'First name, last name and phone number are required'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    error: 'This email is already registered'
                });
            }

            // Create user (role = patient by default)
            const user = new User({ 
                email, 
                password, 
                role: 'patient' 
            });
            await user.save();

            // Create patient profile
            const patientProfile = new PatientProfile({
                userId: user._id,
                ...profile
            });
            await patientProfile.save();

            // Generate token
            const token = await user.generateAuthToken();

            res.status(201).json({
                success: true,
                message: 'Patient registered successfully',
                data: {
                    user: {
                        ...user.toJSON(),
                        profile: patientProfile
                    },
                    token
                }
            });

        } catch (error) {
            console.error('Register patient error:', error);
            
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    error: 'This email is already registered'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    // Admin tạo tài khoản bác sĩ
    static async createDoctor(req, res) {
        try {
            const { email, password, profile } = req.body;

            // Validation
            if (!email || !password || !profile) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    error: 'Email, password and profile are required'
                });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format',
                    error: 'Please provide valid email'
                });
            }

            // Validate doctor profile
            const { firstName, lastName, specialization } = profile;
            if (!firstName || !lastName || !specialization) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing doctor information',
                    error: 'First name, last name and specialization are required'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    error: 'This email is already registered'
                });
            }

            // Create user
            const user = new User({ 
                email, 
                password, 
                role: 'doctor',
                isActive: false // Chờ admin kích hoạt
            });
            await user.save();

            // Create doctor profile
            const doctorProfile = new DoctorProfile({
                userId: user._id,
                ...profile
            });
            await doctorProfile.save();

            res.status(201).json({
                success: true,
                message: 'Doctor account created successfully',
                data: {
                    user: {
                        ...user.toJSON(),
                        profile: doctorProfile
                    }
                }
            });

        } catch (error) {
            console.error('Create doctor error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Kích hoạt tài khoản bác sĩ
    static async activateDoctor(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId);
            if (!user || user.role !== 'doctor') {
                return res.status(404).json({
                    success: false,
                    message: 'Doctor not found',
                    error: 'Invalid doctor ID'
                });
            }

            user.isActive = true;
            await user.save();

            res.json({
                success: true,
                message: 'Doctor account activated successfully',
                data: {
                    user: user.toJSON()
                }
            });

        } catch (error) {
            console.error('Activate doctor error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Đăng nhập chung
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing credentials',
                    error: 'Email and password are required'
                });
            }

            const user = await User.findByCredentials(email, password);
            const token = await user.generateAuthToken();

            // Update last login
            user.lastLoginAt = new Date();
            await user.save();

            // Get profile based on role
            let profile = null;
            if (user.role === 'doctor') {
                profile = await DoctorProfile.findOne({ userId: user._id });
            } else if (user.role === 'patient') {
                profile = await PatientProfile.findOne({ userId: user._id });
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        ...user.toJSON(),
                        profile
                    },
                    token,
                    expiresIn: '24h'
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                error: error.message
            });
        }
    }

    // Get profile
    static async getProfile(req, res) {
        try {
            const user = req.user;
            let profile = null;

            if (user.role === 'doctor') {
                profile = await DoctorProfile.findOne({ userId: user._id });
            } else if (user.role === 'patient') {
                profile = await PatientProfile.findOne({ userId: user._id });
            }

            res.json({
                success: true,
                message: 'Profile retrieved successfully',
                data: {
                    user: {
                        ...user.toJSON(),
                        profile
                    }
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Logout
    static async logout(req, res) {
        try {
            req.user.tokens = req.user.tokens.filter((tokenObj) => {
                return tokenObj.token !== req.token;
            });
            
            await req.user.save();
            
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
                error: error.message
            });
        }
    }

    // Get pending doctors (admin only)
    static async getPendingDoctors(req, res) {
        try {
            const pendingDoctors = await User.find({ 
                role: 'doctor', 
                isActive: false 
            }).select('-password -tokens');

            const doctorsWithProfiles = await Promise.all(
                pendingDoctors.map(async (doctor) => {
                    const profile = await DoctorProfile.findOne({ userId: doctor._id });
                    return {
                        ...doctor.toJSON(),
                        profile
                    };
                })
            );

            res.json({
                success: true,
                message: 'Pending doctors retrieved successfully',
                data: {
                    doctors: doctorsWithProfiles
                }
            });

        } catch (error) {
            console.error('Get pending doctors error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;