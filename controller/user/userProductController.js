// controller/user/userProductController.js
const Product = require('../../model/productSchema'); // Adjust path based on your structure

const getProducts = async (req, res) => {
  try {
    const { search, sort, category, minPrice, maxPrice, brand } = req.query;

    // Build query object
    let query = {
      isDeleted: false, // Hide soft-deleted products
      status: 'Active'  // Hide inactive products
    };

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    // Filter by category (assuming you'll add this field)
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

    // Sorting logic
    let sortOption = {};
    switch (sort) {
      case 'price-low-to-high':
        sortOption.price = 1;
        break;
      case 'price-high-to-low':
        sortOption.price = -1;
        break;
      case 'a-z':
        sortOption.name = 1;
        break;
      case 'z-a':
        sortOption.name = -1;
        break;
      case 'new-arrivals':
        sortOption.updatedAt = -1;
        break;
      default:
        sortOption.updatedAt = -1; // Default: newest first
    }

    // Fetch products
    const products = await Product.find(query).sort(sortOption);

    // Fetch distinct categories and brands for dropdowns
    const categories = await Product.distinct('category', { isDeleted: false, status: 'Active' });
    const brands = await Product.distinct('brand', { isDeleted: false, status: 'Active' });

    // Render EJS view with products
    res.render('shop', {
      products,
      categories,
      brands,
      search: search || '',
      sort: sort || '',
      category: category || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      brand: brand || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

module.exports = { getProducts };