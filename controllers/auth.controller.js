// controllers/authController.js
const User = require('../models/user.model');
const DoctorProfile = require('../models/doctor.model');
const PatientProfile = require('../models/patient.model');

const validator = require('validator');

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { email, password, role, profile } = req.body;

            // Validation
            if (!email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                    error: 'Email, password and role are required'
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

            if (!['doctor', 'patient'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role',
                    error: 'Role must be doctor or patient'
                });
            }

            // Validate profile based on role
            if (role === 'doctor' && (!profile || !profile.firstName || !profile.lastName || !profile.specialization)) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing doctor profile information',
                    error: 'Doctor must provide firstName, lastName, and specialization'
                });
            }

            if (role === 'patient' && (!profile || !profile.firstName || !profile.lastName)) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing patient profile information',
                    error: 'Patient must provide firstName and lastName'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    error: 'This email is already registered. Please use a different email or try logging in.'
                });
            }

            // Create user
            const user = new User({ email, password, role });
            await user.save();

            // Create profile based on role
            let userProfile = null;
            if (role === 'doctor' && profile) {
                const doctorProfile = new DoctorProfile({
                    userId: user._id,
                    ...profile
                });
                await doctorProfile.save();
                userProfile = doctorProfile;
            } else if (role === 'patient' && profile) {
                const patientProfile = new PatientProfile({
                    userId: user._id,
                    ...profile
                });
                await patientProfile.save();
                userProfile = patientProfile;
            }

            // Generate token
            const token = await user.generateAuthToken();

            // Prepare response data
            const userData = user.toJSON();
            delete userData.password; // Remove password from response
            delete userData.tokens; // Remove tokens array from response

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        ...userData,
                        profile: userProfile
                    },
                    token
                }
            });

        } catch (error) {
            console.error('Register error:', error);
            
            // Handle duplicate key error (MongoDB)
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists',
                    error: 'This email is already registered. Please use a different email.'
                });
            }
            
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: errors.join(', ')
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    // Login user
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

            // Get user profile
            let profile = null;
            if (user.role === 'doctor') {
                profile = await DoctorProfile.findOne({ userId: user._id });
            } else if (user.role === 'patient') {
                profile = await PatientProfile.findOne({ userId: user._id });
            }

            // Prepare response data
            const userData = user.toJSON();
            delete userData.password;
            delete userData.tokens;

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        ...userData,
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

    // Get user profile
    static async getProfile(req, res) {
        try {
            const user = req.user;
            let profile = null;

            if (user.role === 'doctor') {
                profile = await DoctorProfile.findOne({ userId: user._id });
            } else if (user.role === 'patient') {
                profile = await PatientProfile.findOne({ userId: user._id });
            }

            // Prepare response data
            const userData = user.toJSON();
            delete userData.password;
            delete userData.tokens;

            res.json({
                success: true,
                message: 'Profile retrieved successfully',
                data: {
                    user: {
                        ...userData,
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

    // Logout from current device
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

    // Logout from all devices
    static async logoutAll(req, res) {
        try {
            req.user.tokens = [];
            await req.user.save();
            
            res.json({
                success: true,
                message: 'Logged out from all devices successfully'
            });
        } catch (error) {
            console.error('Logout all error:', error);
            res.status(500).json({
                success: false,
                message: 'Logout from all devices failed',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;