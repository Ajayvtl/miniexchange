const express = require('express');
const {
    addWallet,
    getWalletsByUser,
    updateWalletStatus,
    deleteWallet,
    restoreWallet,
    backupWallet
} = require('../controllers/walletController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import middleware
const router = express.Router();
router.post('/', verifyToken, addWallet); // Add a wallet (authenticated)
router.get('/:userId', verifyToken, getWalletsByUser); // Get wallets by user (authenticated)
router.put('/:id', verifyToken, updateWalletStatus); // Enable/Disable or Block/Unblock wallet (authenticated)
router.delete('/:id', verifyToken, deleteWallet); // Delete wallet (authenticated)
router.post('/restore', restoreWallet); // Wallet restoration
router.post('/backup', backupWallet); // Wallet restoration
module.exports = router;
