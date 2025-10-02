// models/appointment.model.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorUser',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientProfile',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    dateBooking: { type: String, required: true },  // ví dụ: "2025-09-28"
    timeBooking: { type: String, required: true },  // ví dụ: "09:00 - 09:30"
    description: { type: String },                  // triệu chứng
    isSentForms: { type: Boolean, default: false }, // đã gửi form chưa
    isTakeCare: { type: Boolean, default: false },  // đang được chăm sóc sau khám chưa
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    strict: true
});

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');
