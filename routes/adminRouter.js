const express=require('express');
const router=express.Router();
const adminController=require('../controller/admin/adminController');
const customerController=require('../controller/admin/customerController')
router.get('/login',adminController.loadLogin);
router.post('/verifyLogin',adminController.verifyLogin);
router.get('/users', customerController.customerInfo);
router.post('/blockCustomer', customerController.blockCustomer);


module.exports=router;

