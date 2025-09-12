// models/DoctorUser.js
const mongoose = require('mongoose');

const doctorUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    specializationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true
    },
    licenseNumber: String,
    experience: Number, // years
    consultationFee: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('DoctorUser', doctorUserSchema);