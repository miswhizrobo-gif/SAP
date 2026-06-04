const express = require('express');
const { registerUser, loginUser, getProfile, getAllEmployees } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getProfile);
router.get('/employees', auth, adminOnly, getAllEmployees);

module.exports = router;
