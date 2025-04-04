const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getTaskReport, getUsersReport } = require('../controllers/reportController');



const router = express.Router();

router.get("/export/tasks", protect,adminOnly, getTaskReport);
router.get("/export/users", protect,adminOnly, getUsersReport);

module.exports = router