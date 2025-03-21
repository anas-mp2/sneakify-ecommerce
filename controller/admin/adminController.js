const Admin=require('../../model/adminSchema');



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

module.exports={loadLogin,verifyLogin};