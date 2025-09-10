// models/Doctor.js
const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    bio: String,
    clinicAddress: String
}, {
    timestamps: true
});

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);
module.exports = DoctorProfile;