// models/supporter.model.js
const mongoose = require('mongoose');

const supporterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: String,
    phoneNumber: String,
    thumbnail: String,
}, {
    timestamps: true,
    strict: true
});

module.exports = mongoose.model('Supporter', supporterSchema, 'supporters');