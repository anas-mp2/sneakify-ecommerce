const User = require('../../model/userSchema');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const bcrypt=require('bcrypt');

const loadLoginPage = async (req, res) => {
    try {
        return res.render("login", { message: "" }); 
    } catch (error) {
        console.log("Unable to load login page");
        res.status(500).send("Server error");
    }
};


const pageNotFound = (req, res) => {
    try {
        res.render("pageNotFound");
    } catch (error) {
        res.redirect('/pageNotFound');
    }
};

const loadSignupPage = async (req, res) => {
    try {
        res.render("signup",{message:""});
    } catch (error) {
        console.log("Unable to load signup page");
        res.status(500).send("Server error");
    }
};

const backToLogin = async (req, res) => {
    try {
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP is: ${otp}`,
            html: `<b>Your OTP: ${otp}</b>`,
        });

        return info.accepted && info.accepted.length > 0;
    } catch (error) {
        console.error("Error sending email", error);
        return false;
    }
}

const signup = async (req, res) => {
    const { email, password, cpassword } = req.body;
    
    try {
      
            if (password !== cpassword) {
                return res.render("signup", { message: "Passwords do not match" ,messageSuccess:""});
            }

            User.findOne({ email }).then(async (findUser) => {
                if (findUser) {
                    return res.render("signup", { message: "User with this email already exists" ,messageSuccess:""});
                }

                const otp = generateOtp();
                console.log("Generated OTP: ", otp);

                const emailSent = await sendVerificationEmail(email, otp);
                console.log("Email Sent Status: ", emailSent);

                if (!emailSent) {
                    return res.render("signup", { message: "Failed to send OTP. Please try again.",messageSuccess:"" });
                }

                req.session.userOtp = otp;
                req.session.userData = { email, password };
        
                console.log("OTP sent:", otp);
                return res.render("verify-otp");
            });

    } catch (error) {
        console.error("Signup error", error);
        return res.redirect('/pageNotFound');
    }
};


const securePassword=async (password)=>{
    try{
    const passwordHash=await bcrypt.hash(password,10)
    return passwordHash;
    }catch(error){

    }
}
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        console.log("Entered OTP:", otp);

        if (!req.session.userData) {
            return res.status(400).json({ success: false, message: "Session expired. Please sign up again." });
        }

        if (otp === req.session.userOtp) {
            const user = req.session.userData;

            const passwordHash = await securePassword(user.password);

            const saveUserData = new User({
                email: user.email,
                password: passwordHash,
            });

            await saveUserData.save();
            req.session.user = saveUserData._id;

            res.json({ success: true, redirectUrl: "/" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP, Please try again" });
        }
    } catch (error) {
        console.error("Error Verifying OTP", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
};

  

const resendOtp = async (req, res) => {
    try {
        if (!req.session.userData || !req.session.userData.email) {
            return res.status(400).json({ success: false, message: "Email not found in session" ,messageSuccess:""});
        }

        const email = req.session.userData.email;
        const otp = generateOtp();
        req.session.userOtp = otp;

        const emailSent = await sendVerificationEmail(email, otp);

        if (emailSent) {
            console.log("Resent OTP:", otp);
            return res.render("verify-otp", { message: "" ,messageSuccess:"OTP resend successfully"}); // Rendering OTP page with a success message
        } else {
            return res.status(500).json({ success: false, message: "Failed to resend OTP, Please try again",messageSuccess:"" });
        }
    } catch (error) {
        console.error("Error resending OTP", error);
        return res.status(500).json({ success: false, message: "Internal Server Error. Please try again",messageSuccess:"" });
    }
};

const login=async (req,res)=>{
    try{
       var{email,password}=req.body;

       const findUser= await User.findOne({isAdmin:0,email:email});
       if(!findUser){
        return res.render("login",{message:"User not found",messageSuccess:""});
       }
       if(findUser.isBlocked){
        return res.render("login",{message:"User is blocked by admin"});
       }

       console.log(password);
       console.log(findUser.password);
       const passwordMatch= await bcrypt.compare(password,findUser.password);

       if(!passwordMatch){
        return res.render("login",{message:"Incorrect Password",messageSuccess:""});
       }

     res.json("welcome");




    }catch(error){
      console.error("login error",error);
      res.render("login",{message:"login failed. Please try again later",messageSuccess:""});
    }
}

const forgotPasswordOtp=async (req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
           return res.render("forgot-password",{message:"",messageSuccess:"Please enter Email"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.render("forgot-password",{message:"Email doesn't exist",messageSuccess:""});
        }
        
        const otp=generateOtp();
        console.log("otp is",otp);
        const otpExpires = new Date(Date.now() + 5 * 60000);

        user.otp=otp;
        user.email=email;
        user.otpExpires=otpExpires;
        await user.save();
        

        req.session.otp=otp;
        req.session.otpExpires=otpExpires;
        req.session.email=email;


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL, 
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
        
            

        const mailOptions={
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Your OTP Code",
            text:`Your OTP Code is ${otp} , Use this to reset your Password`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err){
                console.log("====",err);
               return res.render("forgot-password",{message:"Error in Sending Email",messageSuccess:""});
            }
           res.render("forgot-password-otp",{message:"",messageSuccess:""});
        });
 
    }catch(error){
        console.log("error is", error);
        res.render("pageNotFound");
    } 
    
}

const verifyForgotPasswordOtp=async (req,res)=>{
    try{
        var {otp}=req.body;
       
        otp=otp.join("")
        console.log(otp);
        if(otp===",,,,,"){
            return res.render("forgot-password-otp",{message:"OTP is required"});
        }

        const storedOtp=req.session.otp;
        console.log(storedOtp);
        if(!storedOtp){
            return res.render("forgot-password-otp",{message:"OTP expired, Please request a new one"});
        }
        if(storedOtp!=otp){
            return res.render("forgot-password-otp",{message:"Invalid OTP"});
        }
        return res.render("change-password");
    }catch(error){
       console.log("error is",error);
    }
}

const resendForgotPasswordOtp= async(req,res)=>{
    try{
         
        email=req.session.email;
        const user=await User.findOne({email});

        const otp=generateOtp();
        console.log("otp is",otp);
        const otpExpires = new Date(Date.now() + 5 * 60000);

        user.otp=otp;
        user.otpExpires=otpExpires;
        await user.save();
        

        req.session.otp=otp;
        req.session.otpExpires=otpExpires;


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,  
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
        
            

        const mailOptions={
            from:process.env.NODEMAILER_EMAIL,
            to:email,
            subject:"Your OTP Code",
            text:`Your OTP Code is ${otp} , Use this to reset your Password`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err){
                console.log("====",err);
               return res.render("forgot-password",{message:"Error in Sending Email",messageSuccess:""});
            }
           res.render("forgot-password-otp",{message:"",messageSuccess:""});
        });
    }
 
    catch(error){
        console.log("error is", error);
        res.render("pageNotFound");
    } ;};

   
    const changePassword = async (req, res) => {
        try {
            const { password, cpassword } = req.body;
    
            if (password !== cpassword) {
                return res.render("change-password", { message: "Passwords do not match" });
            }
    
            const email = req.session.email;
            const user = await User.findOne({ email });
    
            if (!user) {
                return res.render("change-password", { message: "User not found" });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
    
            req.session.destroy(); 
    
            return res.render("login", { message: "Password changed successfully. Please log in." });
        } catch (error) {
            console.error("Error changing password:", error);
            res.render("change-password", { message: "An error occurred. Try again." });
        }
    };
    
    
module.exports = {
    loadLoginPage,
    pageNotFound,
    loadSignupPage,
    backToLogin,
    signup,
    verifyOtp,
    resendOtp,
    login,
    forgotPasswordOtp,
    verifyForgotPasswordOtp,
    resendForgotPasswordOtp,
    changePassword
};