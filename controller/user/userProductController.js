const Product = require('../../model/productSchema');
const Category = require('../../model/categorySchema');

// Get products for the shop page with filtering and sorting
const getShopProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, brand, sort } = req.query;

        // Build the query object
        let query = { isDeleted: false };

        // Search by product name
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by brand
        if (brand) {
            query.brand = brand;
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price-low-to-high') {
            sortOption.price = 1;
        } else if (sort === 'price-high-to-low') {
            sortOption.price = -1;
        } else if (sort === 'a-z') {
            sortOption.name = 1;
        } else if (sort === 'z-a') {
            sortOption.name = -1;
        } else if (sort === 'new-arrivals') {
            sortOption.createdAt = -1;
        }

        // Fetch products
        const products = await Product.find(query).sort(sortOption);

        // Fetch categories and brands for filters
        const categories = await Category.find();
        const brands = await Product.distinct('brand', { isDeleted: false });

        res.render('shop', {
            products,
            categories,
            brands,
            search: search || '',
            category: category || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            brand: brand || '',
            sort: sort || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getShopProducts // Only export user-facing functions
};