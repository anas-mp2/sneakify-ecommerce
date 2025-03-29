const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin/adminController'); // Fix: 'controllers' to 'controller'
const categoryController = require('../controller/admin/categoryController'); // Fix: 'controllers' to 'controller'
const productController = require('../controller/admin/productController');
const upload = require('../middlewares/multerConfig');

// Admin Login Routes
router.get('/login', adminController.loadLogin);
router.post('/verifyLogin', adminController.verifyLogin);

// User Management Routes
router.get('/users', adminController.loadUsers);
router.post('/block-user/:id', adminController.blockUser);
router.post('/unblock-user/:id', adminController.unblockUser);
router.get('/customer-info', adminController.customerInfo);

router.get('/categories', categoryController.listCategories);
router.post('/add-category', categoryController.addCategory);
router.post('/edit-category/:id', categoryController.editCategory);
router.post('/delete-category/:id', categoryController.deleteCategory);

// router.get('/addProducts',productController.getProductAddPage);

module.exports = router;