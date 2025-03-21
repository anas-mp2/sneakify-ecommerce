const User = require('../../model/userSchema'); // Import User Model


const customerInfo = async (req, res) => {
    try {
        console.log("===---===")
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || "";
        const filter = searchQuery ? { name: { $regex: searchQuery, $options: "i" } } : {};

        const users = await User.find(filter).skip(skip).limit(limit);
        console.log(users);
        res.render("users", { users, currentPage: page, searchQuery });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Server Error");
    }
};




const blockCustomer = async (req, res) => {
    try {
        const userId = req.body.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.json({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ message: user.isBlocked ? "User blocked" : "User unblocked" });
    } catch (error) {
        console.log("Error blocking/unblocking user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { customerInfo, blockCustomer };
