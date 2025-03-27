const express=require('express');
const router=express.Router();
const adminController=require('../controller/admin/adminController');
const categoryController=require('../controller/admin/categoryController');

router.get('/login',adminController.loadLogin);
router.post('/verifyLogin',adminController.verifyLogin);
router.post('/block-user/:id',adminController.blockUser);
router.post('/unblock-user/:id',adminController.unblockUser);
router.get('/users',adminController.loadUsers);
router.get('/category',categoryController.loadCategories);
router.post('/add-category', categoryController.addCategory);
router.post('/edit-category/:id', categoryController.editCategory);
router.post('/delete-category/:id', categoryController.deleteCategory);

module.exports=router;

