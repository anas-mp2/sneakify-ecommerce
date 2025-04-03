const Product = require('../../model/productSchema');
const Category = require('../../model/categorySchema');

const getShopProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, brand, sort, error } = req.query;

        let query = { isDeleted: false };
        if (search) query.name = { $regex: search, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (brand) query.brand = brand;

        let sortOption = {};
        if (sort === 'price-low-to-high') sortOption.price = 1;
        else if (sort === 'price-high-to-low') sortOption.price = -1;
        else if (sort === 'a-z') sortOption.name = 1;
        else if (sort === 'z-a') sortOption.name = -1;
        else if (sort === 'new-arrivals') sortOption.createdAt = -1;

        const products = await Product.find(query).sort(sortOption);
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
            sort: sort || '',
            error: error || '' // Pass error from query
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getShopProducts };