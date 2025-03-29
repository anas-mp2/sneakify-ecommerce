const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    brand: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);