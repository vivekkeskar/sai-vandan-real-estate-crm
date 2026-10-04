const express = require('express');
const router = express.Router();
const { getReportByType } = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

router.get('/:type', protect, getReportByType);

module.exports = router;
