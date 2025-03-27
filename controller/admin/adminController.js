// Import required modules
const User = require('../../model/userSchema'); // Import the User model for user-related operations
const crypto = require('crypto'); // For Gravatar hashing
const bcrypt = require('bcrypt'); // For hashing and comparing passwords
require('dotenv').config(); // Load environment variables from the .env file

// Get the admin email and password from the .env file
const adminEmail = process.env.ADMIN_EMAIL;
// Hash the admin password from the .env file
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

// Function to load the admin login page
const loadLogin = async (req, res) => {
    try {
        // Render the adminLogin page with an empty message
        res.render("adminLogin", { message: "" });
    } catch (error) {
        // If there's an error, render the pageNotFound page
        res.render("pageNotFound");
        console.log("your error is :-", error); // Log the error
    }
};

// Function to verify the admin login
const verifyLogin = async (req, res) => {
    try {
        // Log the request for debugging
        console.log("Received POST request to /verifyLogin");
        console.log("Request Body:", req.body);

        // Get the email and password from the form
        const { email, password } = req.body;

        // Check if the email matches the predefined admin email
        if (email !== adminEmail) {
            // If email doesn't match, show an error message
            return res.render("adminLogin", { message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed admin password
        const isPasswordValid = bcrypt.compareSync(password, adminPasswordHash);

        // If the password is incorrect, show an error message
        if (!isPasswordValid) {
            return res.render("adminLogin", { message: "Invalid email or password" });
        }

        // If login is successful, save the admin's email in the session
        req.session.admin = { email: adminEmail };

        // Redirect to the admin dashboard
        res.render('adminDashboard');
    } catch (error) {
        // Log any errors and send a server error response
        console.log("You are facing the error:", error);
        res.status(500).send('Server Error');
    }
};

// Function to load the users page
// Function to load the users page
// Function to load the users page
const loadUsers = async (req, res) => {
    try {
        // Check if the admin is logged in
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }

        // Get the current page and search query from query parameters
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.search || ''; // Get search term (empty if not provided)
        const limit = 10; // Number of users per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Build the query for filtering users
        let query = {};
        if (searchQuery) {
            // Search by name (if exists) or email, case-insensitive
            query = {
                $or: [
                    { name: { $regex: searchQuery, $options: 'i' } }, // Partial match for name
                    { email: { $regex: searchQuery, $options: 'i' } } // Partial match for email
                ]
            };
        }

        // Get the total number of users matching the query
        const totalUsers = await User.countDocuments(query);

        // Fetch users for the current page, sorted by createdOn in descending order
        const users = await User.find(query)
            .sort({ createdOn: -1 }) // Latest first
            .skip(skip)
            .limit(limit);

        // Add Gravatar hash to each user (for fallback)
        const usersWithGravatar = users.map(user => {
            const email = user.email ? user.email.trim().toLowerCase() : '';
            const hash = crypto.createHash('md5').update(email).digest('hex');
            return {
                ...user._doc,
                gravatarHash: hash
            };
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalUsers / limit);

        // Render the users page with pagination and search data
        res.render("users", { 
            users: usersWithGravatar, 
            currentPage: page, 
            totalPages,
            totalUsers,
            searchQuery // Pass the search term back to the frontend
        });
    } catch (error) {
        console.log("your error is :-", error);
        res.status(500).send('Server Error');
    }
};
// Function to block a user
const blockUser = async (req, res) => {
    try {
        // Check if the admin is logged in
        if (!req.session.admin) {
            // If not logged in, redirect to the login page
            return res.redirect('/admin/login');
        }

        // Get the user ID from the URL parameters
        const userId = req.params.id;
        // Update the user in the database to set isBlocked to true
        await User.findByIdAndUpdate(userId, { isBlocked: true });
        // Get the current page from query parameters
        const page = req.query.page || 1;
        // Redirect back to the users page
        res.redirect(`/admin/users?page=${page}`);
    } catch (error) {
        // Log any errors and send a server error response
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Function to unblock a user
const unblockUser = async (req, res) => {
    try {
        // Check if the admin is logged in
        if (!req.session.admin) {
            // If not logged in, redirect to the login page
            return res.redirect('/admin/login');
        }

        // Get the user ID from the URL parameters
        const userId = req.params.id;
        // Update the user in the database to set isBlocked to false
        await User.findByIdAndUpdate(userId, { isBlocked: false });
        // Get the current page from query parameters
        const page = req.query.page || 1;
        // Redirect back to the users page
        res.redirect(`/admin/users?page=${page}`);
    } catch (error) {
        // Log any errors and send a server error response
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Function to load customer info (users page)
const customerInfo = async (req, res) => {
    try {
        // Check if the admin is logged in
        if (!req.session.admin) {
            // If not logged in, redirect to the login page
            return res.redirect('/admin/login');
        }

        // Render the users page
        res.render("users");
    } catch (error) {
        // Log any errors
        console.log("your error is : - ", error);
        res.status(500).send('Server Error');
    }
};


module.exports = { loadLogin, verifyLogin, blockUser, unblockUser, customerInfo, loadUsers };