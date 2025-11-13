const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
    {
        title: String,
        role: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

const Role = mongoose.model('Role', RoleSchema, 'roles')

module.exports = Role;