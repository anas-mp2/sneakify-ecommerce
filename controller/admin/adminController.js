const User = require('../../model/userSchema'); 
const crypto = require('crypto'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);


const loadLogin = async (req, res) => {
    try {
       
        res.render("adminLogin", { message: "" });
    } catch (error) {
       
        res.render("admin/pageNotFound");
        console.log("your error is :-", error); 
    }
};

const verifyLogin = async (req, res) => {
    try {
        
        console.log("Received POST request to /verifyLogin");
        console.log("Request Body:", req.body);

        const { email, password } = req.body;

      
        if (email !== adminEmail) {
           
            return res.render("adminLogin", { message: "Invalid email or password" });
        }

        const isPasswordValid = bcrypt.compareSync(password, adminPasswordHash);

       
        if (!isPasswordValid) {
            return res.render("adminLogin", { message: "Invalid email or password" });
        }

        req.session.admin = { email: adminEmail };

        res.render('adminDashboard');
    } catch (error) {
        
        console.log("You are facing the error:", error);
        res.status(500).send('Server Error');
    }
};

const loadUsers = async (req, res) => {
    try {
       
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

      
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.search || ''; 
        const limit = 6;
        const skip = (page - 1) * limit;

     
        let query = {};
        if (searchQuery) {
           
            query = {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } }, 
                    { email: { $regex: searchQuery, $options: 'i' } } 
                ]
            };
        }

  
        const totalUsers = await User.countDocuments(query);

        const users = await User.find(query)
            .sort({ createdOn: -1 }) 
            .skip(skip)
            .limit(limit);

        const usersWithGravatar = users.map(user => {
            const email = user.email ? user.email.trim().toLowerCase() : '';
            const hash = crypto.createHash('md5').update(email).digest('hex');
            return {
                ...user._doc,
                gravatarHash: hash
            };
        });

       
        const totalPages = Math.ceil(totalUsers / limit);

        res.render("users", { 
            users: usersWithGravatar, 
            currentPage: page, 
            totalPages,
            totalUsers,
            searchQuery 
        });
    } catch (error) {
        console.log("your error is :-", error);
        res.status(500).send('Server Error');
    }
};

const blockUser = async (req, res) => {
    try {
        
        if (!req.session.admin) {
            
            return res.redirect('/admin/login');
        }

        const userId = req.params.id;
       
        await User.findByIdAndUpdate(userId, { isBlocked: true });
      
        const page = req.query.page || 1;
        
        res.redirect(`/admin/users?page=${page}`);
    } catch (error) {
        
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const unblockUser = async (req, res) => {
    try {
       
        if (!req.session.admin) {
          
            return res.redirect('/admin/login');
        }

        const userId = req.params.id;
        
        await User.findByIdAndUpdate(userId, { isBlocked: false });
      
        const page = req.query.page || 1;
       
        res.redirect(`/admin/users?page=${page}`);
    } catch (error) {
       
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const customerInfo = async (req, res) => {
    try {
       
        if (!req.session.admin) {
      
            return res.redirect('/admin/login');
        }

        res.render("users");
    } catch (error) {
      
        console.log("your error is : - ", error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadUsers,
    blockUser,
    unblockUser,
    customerInfo
};