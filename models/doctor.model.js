// models/Doctor.js
const mongoose = require('mongoose');
const slugUpdater = require('mongoose-slug-updater');

mongoose.plugin(slugUpdater);
const doctorSchema = new mongoose.Schema({
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
    phoneNumber: String,
    licenseNumber: String,
    experience: Number, // years
    consultationFee: Number,
    name: { type: String, required: true },
    slug: { type: String, slug: "name", unique: true },
    thumbnail: String,
    isDeleted: { type: Boolean, default: false },
    isFamilyDoctor: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true,
    strict: true
});

module.exports = mongoose.model('Doctor', doctorSchema, 'doctors');