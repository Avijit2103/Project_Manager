const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const authRoutes = express.Router();

//authRoute
authRoutes.post("/register", registerUser) //Register User
authRoutes.post("/login", loginUser)  //LoginUser
authRoutes.get('/profile', protect, getUserProfile) //Get User Profile
authRoutes.put('/profile', protect, updateUserProfile) // Update User Profile

authRoutes.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl });
});

module.exports = authRoutes

