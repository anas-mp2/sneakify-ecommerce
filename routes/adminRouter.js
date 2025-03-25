const express=require('express');
const router=express.Router();
const adminController=require('../controller/admin/adminController');
router.get('/login',adminController.loadLogin);
router.post('/verifyLogin',adminController.verifyLogin);
router.post('/block-user/:id',adminController.blockUser);
router.post('/unblock-user/:id',adminController.unblockUser);
router.get('/users',adminController.loadUsers);


module.exports=router;

