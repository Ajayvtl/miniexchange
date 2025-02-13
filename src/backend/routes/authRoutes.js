const express = require('express');
const { login, authenticateWallet, appLogin, appRegister, refreshToken } = require('../controllers/authController');

const router = express.Router();

// Login Route
router.post('/login', login);
router.post('/wallet/authenticate', authenticateWallet); // Authenticate the wallet and issue tokens
router.post('/app/register', appRegister);
router.post('/app/login', appLogin);
router.post('/app/refresh-token', refreshToken);
module.exports = router;
