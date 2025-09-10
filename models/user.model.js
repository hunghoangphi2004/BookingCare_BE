// models/User.js
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Array lưu nhiều tokens cho multi-device login
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // Profile data dựa theo role
    profile: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password trước khi save
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }
    next();
});

// Instance method: Generate auth token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString(), role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Static method: Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('Invalid login credentials');
    }

    if (!user.isActive) {
        throw new Error('Account has been deactivated');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }

    return user;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;
    
    return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;