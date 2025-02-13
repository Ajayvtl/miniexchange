const express = require('express');
const walletTypeController = require('../controllers/walletTypeController');

const router = express.Router();

// ✅ Create a new wallet type
router.post('/', walletTypeController.createWalletType);

// ✅ Get all wallet types
router.get('/', walletTypeController.getAllWalletTypes);

// ✅ Get a specific wallet type by ID
router.get('/:id', walletTypeController.getWalletTypeById);

// ✅ Update a wallet type
router.put('/:id', walletTypeController.updateWalletType);

// ✅ Delete a wallet type
router.delete('/:id', walletTypeController.deleteWalletType);

module.exports = router;
