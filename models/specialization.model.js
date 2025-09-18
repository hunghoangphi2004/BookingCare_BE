// models/Specialization.js
const mongoose = require('mongoose');
const slugUpdater = require('mongoose-slug-updater');

mongoose.plugin(slugUpdater);

const specializationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: { type: String, slug: "name", unique: true },
    description: String,
    image: String,
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Specialization', specializationSchema,'specializations');