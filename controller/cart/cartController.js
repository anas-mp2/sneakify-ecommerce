const Product = require('../../model/productSchema');

const addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findOne({ _id: productId, isDeleted: false });

        if (!product || product.stock === 0) {
            return res.status(400).json({ success: false, message: 'Product unavailable or out of stock' });
        }

        // Add your cart logic here (e.g., save to session or database)
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { addToCart };