const Product = require('../../model/productSchema');

const getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        
        console.log('Fetching product details for ID:', productId);
        const product = await Product.findOne({ _id: productId, isDeleted: false })
            .populate('category');
        
        if (!product) {
            console.log('Product not found or unavailable for ID:', productId);
            return res.redirect('/products?error=Product+not+found+or+unavailable');
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: productId },
            isDeleted: false
        }).limit(4);

        const avgRating = product.reviews.length > 0 
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
            : 0;

        res.render('product-details', {
            product,
            relatedProducts,
            avgRating,
            breadcrumbs: [
                { name: 'Home', url: '/' },
                { name: 'Shop', url: '/products' },
                { name: product.name, url: '' }
            ]
        });
    } catch (error) {
        console.error('Error in getProductDetails:', error.stack);
        res.status(500).send('Server Error');
    }
};

const submitReview = async (req, res) => {
    try {
        console.log('Submit review route hit for product ID:', req.params.id);
        const productId = req.params.id;
        const { rating, comment } = req.body;

        console.log('Request body:', { rating, comment });

        if (!rating || !comment) {
            console.log('Validation failed: Rating or comment missing');
            return res.status(400).json({ success: false, message: 'Rating and comment are required' });
        }

        if (isNaN(parseInt(rating)) || parseInt(rating) < 1 || parseInt(rating) > 5) {
            console.log('Validation failed: Invalid rating value');
            return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
        }

        console.log('Searching for product with ID:', productId);
        const product = await Product.findOne({ _id: productId, isDeleted: false });
        if (!product) {
            console.log('Product not found or unavailable for ID:', productId);
            return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
        }

        console.log('Product found:', product);

        const newReview = {
            rating: parseInt(rating),
            comment,
            date: new Date()
        };
        product.reviews.push(newReview);

        console.log('Product with new review:', product);

        // Save only the modified fields to avoid validating unchanged fields like category
        await product.save({ validateModifiedOnly: true });
        console.log('Product saved successfully');

        res.status(200).json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error.stack);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getProductDetails,
    submitReview
};