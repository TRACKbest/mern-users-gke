const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, validateRegister, validateLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);

module.exports = router;
