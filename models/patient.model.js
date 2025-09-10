// models/Patient.js
const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
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
    dateOfBirth: Date,
    phoneNumber: String,
    address: String,
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    medicalHistory: [{
        condition: String,
        date: Date,
        notes: String
    }]
}, {
    timestamps: true
});

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
module.exports = PatientProfile;