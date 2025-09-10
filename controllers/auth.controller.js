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
                    error: 'Email, password and role are required'
                });
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    error: 'Please provide valid email'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password must be at least 6 characters'
                });
            }

            if (!['doctor', 'patient'].includes(role)) {
                return res.status(400).json({
                    error: 'Role must be doctor or patient'
                });
            }

            // Create user
            const user = new User({ email, password, role });
            await user.save();

            // Create profile based on role
            if (role === 'doctor' && profile) {
                const doctorProfile = new DoctorProfile({
                    userId: user._id,
                    ...profile
                });
                await doctorProfile.save();
                user.profile = doctorProfile;
            } else if (role === 'patient' && profile) {
                const patientProfile = new PatientProfile({
                    userId: user._id,
                    ...profile
                });
                await patientProfile.save();
                user.profile = patientProfile;
            }

            // Generate token
            const token = await user.generateAuthToken();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user,
                token
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    error: 'Email already exists'
                });
            }
            res.status(400).json({ error: error.message });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            const user = await User.findByCredentials(email, password);
            const token = await user.generateAuthToken();

            // Update last login
            user.lastLoginAt = new Date();
            await user.save();

            res.json({
                success: true,
                message: 'Login successful',
                user,
                token
            });

        } catch (error) {
            res.status(401).json({
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

            res.json({
                success: true,
                user: {
                    ...user.toJSON(),
                    profile
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AuthController;