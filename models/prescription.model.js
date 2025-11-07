// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: { type: String, enum: ['draft', 'final'], default: 'draft' },
    notes: String,
    medicines: [
        {
            medicineId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Medicine',
                required: true,
            },
            name: String,
            dosage: String,
            duration: String,
            instructions: String,
        },
    ],
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Prescription', prescriptionSchema, 'prescriptions');
