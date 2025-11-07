const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, default: "viên" },
    description: String,
    usage: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema, 'medicines');
