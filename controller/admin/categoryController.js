const Category = require('../../model/categorySchema');

const listCategories = async (req, res) => {
    const searchQuery = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const query = { isDeleted: false };
    if (searchQuery) {
        query.brand = { $regex: searchQuery, $options: 'i' };
    }

    try {
        const categories = await Category.find(query)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalCategories = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / limit);

        res.render('categories', {
            categories,
            searchQuery,
            currentPage: page,
            totalPages,
            limit,
            error: null,
            formData: null
        });
    } catch (err) {
        console.error('List Categories Error:', err.message);
        res.status(500).send('Server Error');
    }
};

const addCategory = async (req, res) => {
    const { brand, description } = req.body;
    try {
        if (!brand || !description) {
            throw new Error('Brand and description are required');
        }
        if (typeof brand !== 'string' || typeof description !== 'string') {
            throw new Error('Brand and description must be strings');
        }
        if (brand.trim() === '' || description.trim() === '') {
            throw new Error('Brand and description cannot be empty');
        }

        const newCategory = new Category({ brand: brand.trim(), description: description.trim() });
        await newCategory.save();
        res.redirect('/admin/categories?page=1');
    } catch (err) {
        console.error('Add Category Error:', err.message);
        const categories = await Category.find({ isDeleted: false }).sort({ updatedAt: -1 }).limit(5);
        const totalCategories = await Category.countDocuments({ isDeleted: false });
        const totalPages = Math.ceil(totalCategories / 5);
        res.render('categories', {
            categories,
            searchQuery: req.query.search || '',
            currentPage: 1,
            totalPages,
            limit: 5,
            error: err.message,
            formData: { brand, description }
        });
    }
};

const editCategory = async (req, res) => {
    const { id } = req.params;
    const { brand, description } = req.body;
    try {
        await Category.findByIdAndUpdate(id, { brand, description, updatedAt: Date.now() });
        res.redirect(`/admin/categories?page=${req.query.page}&search=${encodeURIComponent(req.query.search || '')}`);
    } catch (err) {
        console.error('Edit Category Error:', err.message);
        res.status(500).send('Server Error');
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndUpdate(id, { isDeleted: true });
        res.redirect(`/admin/categories?page=${req.query.page}&search=${encodeURIComponent(req.query.search || '')}`);
    } catch (err) {
        console.error('Delete Category Error:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    listCategories,
    addCategory,
    editCategory,
    deleteCategory
};