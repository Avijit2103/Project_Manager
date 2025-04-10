require("dotenv").config();
const express = require("express");
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

//middleware for cors
app.use(
    cors({
    origin: process.env.CLIENT_URL || '*',
    methods:['GET','PUT','DELETE','POST'],
    allowedHeaders: ['Content-Type','Authorization'],
})
);
//middleware
app.use(express.json());

//connect Db
connectDB();
//Routes
 app.use('/api/auth',authRoutes)
 app.use('/api/users',userRoutes)
 app.use('/api/tasks',taskRoutes)
 app.use('/api/report',reportRoutes)
//  upload server folder
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT ,() => console.log(`server running on port ${PORT}`));