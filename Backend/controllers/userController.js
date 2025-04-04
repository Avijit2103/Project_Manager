const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    get all user
// @route   GET /api/users
// @access  private (Admin)

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select('-password');
        //add task counts to each users
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        }))
        res.json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });

    }
}
// @desc    get  user BY ID
// @route   GET /api/users/:ID
// @access  private (Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });

    }
}
// @desc    delete user BY ID
// @route   DELETE /api/users/:ID
// @access  private (Admin)
// const deleteUser = async (req, res) => {
//     try {
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });

//     }
// }
module.exports = { getUsers, getUserById }