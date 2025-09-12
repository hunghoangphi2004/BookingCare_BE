// models/Clinic.js
const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    phone: String,
    description: String,
    image: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Clinic', clinicSchema);