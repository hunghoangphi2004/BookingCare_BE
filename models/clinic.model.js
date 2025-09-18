// models/Clinic.js
const mongoose = require('mongoose');
const slugUpdater = require('mongoose-slug-updater');

mongoose.plugin(slugUpdater);


const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    openingHours: String,
    phone: String,
    description: String,
    image: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Clinic', clinicSchema, 'clinics');