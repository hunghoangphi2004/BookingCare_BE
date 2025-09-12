const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'doctor', 'patient'],
            default: 'patient'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        tokens: {
            type: [{ name: String, token: String }],
            default:[]
        },
        createdAt: Date
    },
    {
        timestamps: true
    }
);

UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        password: this.password
    }, process.env.AUTH_TOKEN_SECRET_KEY)

    const index = this.tokens.findIndex(token => token.name == 'auth_token')

    if (index == -1) this.tokens = this.tokens.concat({ name: 'auth_token', token })        // auth_token should only be 1

    return token
}

const userModel = mongoose.model('users', UserSchema)

module.exports = userModel;
