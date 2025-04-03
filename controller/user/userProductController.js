const Product = require('../../model/productSchema');
const Category = require('../../model/categorySchema');

const getShopProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, brand, sort, error } = req.query;

        // Base query with isDeleted and status filters
        let query = { isDeleted: false, status: "Active" }; // Add status: "Active" here

        // Apply search filter if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Apply category filter if provided
        if (category) {
            query.category = category;
        }

        // Apply price range filter if provided
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Apply brand filter if provided
        if (brand) {
            query.brand = brand;
        }

        // Define sort option based on query parameter
        let sortOption = {};
        if (sort === 'price-low-to-high') sortOption.price = 1;
        else if (sort === 'price-high-to-low') sortOption.price = -1;
        else if (sort === 'a-z') sortOption.name = 1;
        else if (sort === 'z-a') sortOption.name = -1;
        else if (sort === 'new-arrivals') sortOption.createdAt = -1;

        // Fetch products with the applied filters and sorting
        const products = await Product.find(query).sort(sortOption).populate('category');

        // Fetch categories for the filter dropdown
        const categories = await Category.find();

        // Fetch unique brands from active products
        const brands = await Product.distinct('brand', { isDeleted: false, status: "Active" }); // Update to filter by status

        // Render the shop.ejs template
        res.render('shop', {
            products,
            categories,
            brands,
            search: search || '',
            category: category || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            brand: brand || '',
            sort: sort || '',
            error: error || '' // Pass error from query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getShopProducts };g