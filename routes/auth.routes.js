// routes/patient-auth.js
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PatientProfile:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *       properties:
 *         firstName:
 *           type: string
 *           description: Patient's first name
 *           example: "Nguyen"
 *         lastName:
 *           type: string
 *           description: Patient's last name
 *           example: "Van A"
 *         phoneNumber:
 *           type: string
 *           description: Patient's phone number
 *           example: "0901234567"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *           example: "1990-01-01"
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Patient's gender
 *           example: "male"
 *         address:
 *           type: string
 *           description: Patient's address
 *           example: "123 Nguyen Hue, District 1, Ho Chi Minh City"
 *         emergencyContact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Nguyen Van B"
 *             phoneNumber:
 *               type: string
 *               example: "0907654321"
 *             relationship:
 *               type: string
 *               example: "Spouse"
 *     
 *     PatientRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - profile
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Patient's email address
 *           example: "patient@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Patient's password
 *           example: "password123"
 *         profile:
 *           $ref: '#/components/schemas/PatientProfile'
 *     
 *     PatientLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Patient's email address
 *           example: "patient@example.com"
 *         password:
 *           type: string
 *           description: Patient's password
 *           example: "password123"
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 email:
 *                   type: string
 *                   example: "patient@example.com"
 *                 role:
 *                   type: string
 *                   example: "patient"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   $ref: '#/components/schemas/PatientProfile'
 *             token:
 *               type: string
 *               description: JWT authentication token
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             expiresIn:
 *               type: string
 *               example: "24h"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         error:
 *           type: string
 *           example: "Email and password are required"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new patient account
 *     tags: [Patient Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientRegistration'
 *           example:
 *             email: "patient@example.com"
 *             password: "password123"
 *             profile:
 *               firstName: "Nguyen"
 *               lastName: "Van A"
 *               phoneNumber: "0901234567"
 *               dateOfBirth: "1990-01-01"
 *               gender: "male"
 *               address: "123 Nguyen Hue, District 1, Ho Chi Minh City"
 *               emergencyContact:
 *                 name: "Nguyen Van B"
 *                 phoneNumber: "0907654321"
 *                 relationship: "Spouse"
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "Missing required fields"
 *                   error: "Email, password and profile are required"
 *               invalid_email:
 *                 summary: Invalid email format
 *                 value:
 *                   success: false
 *                   message: "Invalid email format"
 *                   error: "Please provide valid email"
 *               password_too_short:
 *                 summary: Password too short
 *                 value:
 *                   success: false
 *                   message: "Password too short"
 *                   error: "Password must be at least 6 characters"
 *               email_exists:
 *                 summary: Email already registered
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *                   error: "This email is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.registerPatient);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login for patients
 *     tags: [Patient Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientLogin'
 *           example:
 *             email: "patient@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Missing credentials"
 *               error: "Email and password are required"
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_credentials:
 *                 summary: Invalid email or password
 *                 value:
 *                   success: false
 *                   message: "Invalid credentials"
 *                   error: "Invalid email or password"
 *               inactive_account:
 *                 summary: Account not active
 *                 value:
 *                   success: false
 *                   message: "Invalid credentials"
 *                   error: "Account is not active"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/patient/profile:
 *   get:
 *     summary: Get patient profile
 *     tags: [Patient Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *                         profile:
 *                           $ref: '#/components/schemas/PatientProfile'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', auth, AuthController.getProfile);

/**
 * @swagger
 * /api/patient/logout:
 *   post:
 *     summary: Logout patient
 *     tags: [Patient Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', auth, AuthController.logout);

module.exports = router;