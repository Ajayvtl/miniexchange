const express = require('express');
const { login, authenticateWallet } = require('../controllers/authController');

const router = express.Router();

// Login Route
router.post('/login', login);
router.post('/wallet/authenticate', authenticateWallet); // Authenticate the wallet and issue tokens
module.exports = router;
