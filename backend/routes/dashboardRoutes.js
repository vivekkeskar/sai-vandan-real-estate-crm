const express = require('express');
const router = express.Router();
const { getDashboardStats, getFinanceStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/finance-stats', protect, getFinanceStats);

module.exports = router;
