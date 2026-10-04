const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getUserProfile);
router.get('/users', protect, getUsers);

module.exports = router;
