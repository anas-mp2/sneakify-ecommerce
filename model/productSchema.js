const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stockCount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    images: {
        type: [String], // Array of strings to store image paths
        required: true,
        validate: [arrayLimitImages, "At least 3 images are required"]
    },
    isDeleted: {
        type: Boolean,
        default: false // For soft delete
    },
    category:{
        type:String,
        required:true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Validator to ensure at least 3 images
function arrayLimitImages(val) {
    return val.length >= 3;
}

module.exports = mongoose.model("Product", productSchema);