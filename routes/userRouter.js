const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../controller/user/userController');



router.get('/',userController.loadLoginPage);
router.get('/pageNotFound',userController.pageNotFound);
router.get('/signup',userController.loadSignupPage);
router.get('/user/login',userController.backToLogin);
router.get('/user/signup',userController.loadSignupPage);
router.post('/signup',userController.signup)
router.post("/verify-otp",userController.verifyOtp);
router.post("/resend-otp",userController.resendOtp);
router.post('/login',userController.login);
router.post('/verify-forgot-password-otp',userController.verifyForgotPasswordOtp);
router.post('/resend-forgot-password-otp',userController.resendForgotPasswordOtp);
router.post('/change-password',userController.changePassword);



router.get('/forgot-password',(req,res)=>{
    res.render("forgot-password",{message:"",messageSuccess:""});
})

router.post('/forgot-password-otp',userController.forgotPasswordOtp)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/');
});


module.exports=router; 