const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateJwtToken = (user_Id) => {
    return jwt.sign({ id: user_Id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }
        let role = 'member'
        if (adminInviteToken &&
            adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = 'admin'
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });
        // Return user data with Jwt
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateJwtToken(user._id),

        });

    } catch (error) {
        res.status(500).json({ message: "server Error", error: error.message })
    }


};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }
        //return data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateJwtToken(user._id),
        });

    } catch (error) {
        res.status(500).json({ message: "server Error", error: error.message })
    }
};

// @desc    GET user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "server Error", error: error.message })
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }
        const updatedUser = await user.save()
        res.json({
            _id:updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token:generateJwtToken(updatedUser._id),
            });
        
    } catch (error) {
        res.status(500).json({ message: "server Error", error: error.message })
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };