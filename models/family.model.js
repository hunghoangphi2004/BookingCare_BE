// models/familyProfile.model.js
const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    familyName: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: { // chủ hộ (có tài khoản)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            _id: false,
            fullName: { type: String, required: true },
            relationship: { type: String, default: "" }, // vợ, chồng, con...
            dateOfBirth: { type: Date },
            gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
            phoneNumber: String,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
            patientProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
        }
    ],

    familyDoctors: [
        {
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
            requestNote: String,
            requestedAt: { type: Date, default: Date.now },
            approvedAt: Date,
            rejectedAt: Date,
            cancelledAt: Date,
            handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
            status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
            rejectionReason: String,
            schedule: {
                startDate: { type: Date },
                frequency: { type: String, enum: ['weekly', 'monthly'], default: 'monthly' },
                dayOfWeek: { type: Number, min: 0, max: 6 }, 
                dayOfMonth: { type: Number, min: 1, max: 31 },
                timeSlot: { type: String } 
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Family', familySchema, 'families');