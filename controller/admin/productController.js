const Product = require('../../model/productSchema');
const Category = require('../../model/categorySchema');
const path = require('path');
const fs = require('fs');
const { upload, processImages } = require('../../middlewares/multerConfig');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false });
        res.render('admin-product', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render add product page
const getAddProduct = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('add-product', { 
            categories,
            message: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Add new product
const addProduct = async (req, res) => {
    try {
        const { name, description, brand, price, stockCount, status, category } = req.body;
        
        if (!req.files || req.files.length < 3) {
            const categories = await Category.find();
            return res.render('add-product', {
                categories,
                message: 'Please upload at least 3 images'
            });
        }

        // Process images using your middleware function
        const processedImagePaths = await processImages(req.files);

        const product = new Product({
            name,
            description,
            brand,
            price,
            stockCount,
            status,
            category,
            images: processedImagePaths
        });

        await product.save();
        res.redirect('/admin/products'); // Redirect to product list
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Render edit product page
const getEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find();
        res.render('edit-product', {
            product,
            categories,
            message: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Update product
const editProduct = async (req, res) => {
    try {
        const { name, description, brand, price, stockCount, status, category } = req.body;
        const product = await Product.findById(req.params.id);

        // Update basic fields
        product.name = name;
        product.description = description;
        product.brand = brand;
        product.price = price;
        product.stockCount = stockCount;
        product.status = status;
        product.category = category;

        // Handle new images if uploaded
        if (req.files && req.files.length > 0) {
            if (req.files.length < 3) {
                const categories = await Category.find();
                return res.render('edit-product', {
                    product,
                    categories,
                    message: 'Please upload at least 3 images if updating images'
                });
            }

            // Delete old images
            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '../../public', image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });

            // Process and save new images
            const processedImagePaths = await processImages(req.files);
            product.images = processedImagePaths;
        }

        await product.save();
        res.redirect('/admin/products'); // Redirect to product list
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Soft delete product
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getProducts,
    deleteProduct,
    editProduct,
    getEditProduct,
    addProduct,
    getAddProduct
};