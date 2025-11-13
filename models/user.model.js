const mongoose = require('mongoose');
const generate = require("../helpers/generate")

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
        },
        avatar: {type: String, default: "https://res.cloudinary.com/doas6zntt/image/upload/v1758441363/avatars/tpgnhscp4odjxknhtfo6.png"},
        role: {
            type: String,
            enum: ['admin', 'doctor', 'patient','supporter'],
            default: 'patient'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        token: {
            type: String,
            default: () => generate.generateRandomString(20)
        },
        createdAt: Date,
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        string: true
    }
);


const userModel = mongoose.model('User', UserSchema, 'users')

module.exports = userModel;
