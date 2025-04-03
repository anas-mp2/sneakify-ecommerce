// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     brand: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     stockCount: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     status: {
//         type: String,
//         enum: ["Active", "Inactive"],
//         default: "Active"
//     },
//     images: {
//         type: [String], // Array of strings to store image paths
//         required: true,
//         validate: [arrayLimitImages, "At least 3 images are required"]
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false // For soft delete
//     },
//     category:{
//         type:String,
//         required:true
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// //Validator to ensure at least 3 images
// function arrayLimitImages(val) {
//     return val.length >= 3;
// }

// module.exports = mongoose.model("Product", productSchema);
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     brand: { type: String, required: true },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//     images: [{ type: String }],
//     isDeleted: { type: Boolean, default: false },
//     stock: { type: Number, required: true, default: 0 },
//     discount: { type: Number, default: 0 }, // Percentage discount
//     highlights: [{ type: String }], // Product specifications
//     reviews: [{
//         user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         rating: { type: Number, min: 1, max: 5 },
//         comment: { type: String },
//         date: { type: Date, default: Date.now }
//     }],
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    highlights: [{ type: String }],
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);