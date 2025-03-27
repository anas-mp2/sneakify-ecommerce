const category=require('../../model/categorySchema');

const Category = require('../../model/categorySchema');

// Load the categories page
const loadCategories = async (req, res) => {
    try {
        // Check if the admin is logged in
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

        // Get the current page and search query from query parameters
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.search || '';
        const limit = 10; // Number of categories per page
        const skip = (page - 1) * limit;

        // Build the query for filtering categories
        let query = { isListed: true }; // Only show listed categories
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search on name
        }

        // Get the total number of categories matching the query
        const totalCategories = await Category.countDocuments(query);

        // Fetch categories for the current page, sorted by createdAt in descending order
        const categories = await Category.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .skip(skip)
            .limit(limit);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCategories / limit);

        // Render the categories page
        res.render("category", { 
            categories, 
            currentPage: page, 
            totalPages,
            totalCategories,
            searchQuery,
            error: req.query.error || ''
        });
    } catch (error) {
        console.error("Error in loadCategories:", error.stack);
        res.status(500).send('Server Error');
    }
};

// Add a new category
const addCategory = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

        const { name, description, categoryOffer } = req.body;
        // Check if category already exists
        const existingCategory = await Category.findOne({ name, isListed: true });
        if (existingCategory) {
            return res.redirect('/admin/category?error=Category already exists');
        }

        // Create new category
        const newCategory = new Category({ 
            name, 
            description, 
            categoryOffer: parseFloat(categoryOffer) || 0 
        });
        await newCategory.save();

        res.redirect('/admin/category');
    } catch (error) {
        console.error("Error in addCategory:", error.stack);
        res.status(500).send('Server Error');
    }
};

// Edit a category
const editCategory = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;
        const { name, description, categoryOffer } = req.body;

        // Check if another category with the same name exists
        const existingCategory = await Category.findOne({ name, isListed: true, _id: { $ne: id } });
        if (existingCategory) {
            return res.redirect(`/admin/category?page=${req.query.page || 1}&search=${req.query.search || ''}&error=Category name already exists`);
        }

        // Update the category
        await Category.findByIdAndUpdate(id, { 
            name, 
            description, 
            categoryOffer: parseFloat(categoryOffer) || 0 
        });
        res.redirect(`/admin/category?page=${req.query.page || 1}&search=${req.query.search || ''}`);
    } catch (error) {
        console.error("Error in editCategory:", error.stack);
        res.status(500).send('Server Error');
    }
};

// Soft delete a category
const deleteCategory = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

        const { id } = req.params;
        await Category.findByIdAndUpdate(id, { isListed: false });
        res.redirect(`/admin/category?page=${req.query.page || 1}&search=${req.query.search || ''}`);
    } catch (error) {
        console.error("Error in deleteCategory:", error.stack);
        res.status(500).send('Server Error');
    }
};

module.exports = { loadCategories, addCategory, editCategory, deleteCategory };