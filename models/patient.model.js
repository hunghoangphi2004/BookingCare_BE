const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
        default: "Chưa cập nhật"
    },
    lastName: {
        type: String,
        trim: true,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other'
    },
    address: {
        type: String,
        default: ""
    },
    emergencyContact: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        relationship: { type: String, default: "" }
    }
}, {
    timestamps: true
});

patientProfileSchema.pre('save', async function(next) {
    if (this.isNew && !this.patientId) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 4).toUpperCase();
        this.patientId = `BN${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
