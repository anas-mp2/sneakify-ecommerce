const Admin=require('../../model/adminSchema');
const User=require('../../model/userSchema');



const verifyLogin = async (req, res) => {
   try {
       console.log("Received POST request to /verifyLogin");
       console.log("Request Body:", req.body);

       res.render("adminDashboard");
   } catch (error) {
       console.log("You are facing the error:", error);
   }
};


const loadLogin=async(req,res)=>{
    try{
       res.render("adminLogin",{message:""});
    }catch(error){
       res.render("pageNotFound");
       console.log("your error is :-",error);
    }
}

const customerInfo=async (req,res)=>{
    try{
        res.render("admin/users");
    }catch(error){
        cosnole.log("your error is : - ",error);
    }
}

const blockUser=async(req,res)=>{
    try{
    const userId=req.params.id;
    await User.findByIdAndUpdate(userId, { isBlocked: true });
    res.redirect('/admin/users');
    }catch(error){
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const unblockUser=async(req,res)=>{
    try{
        const userId=req.params.id;
        await User.findByIdAndUpdate(userId, { isBlocked: false });
        res.redirect('/admin/users');
    }catch(error){
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const loadUsers=async(req,res)=>{
    try{
         res.render("admin/users");
    }catch(error){
       console.log("your error is :-",error);
    }
}

module.exports={loadLogin,verifyLogin,blockUser,unblockUser,customerInfo,loadUsers};