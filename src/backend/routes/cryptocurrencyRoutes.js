const express = require('express');
const { addCryptocurrency, getCryptocurrencies, deleteCryptocurrency, updateCryptocurrency } = require('../controllers/cryptoController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

// Add Cryptocurrency (Only Admin or higher)
router.post('/', verifyToken, checkPermission('manage_cryptocurrencies'), addCryptocurrency);

// Get All Cryptocurrencies (Accessible by all authenticated users)
router.get('/', verifyToken, getCryptocurrencies);

// Delete Cryptocurrency (Only Admin or higher)
router.delete('/:id', verifyToken, checkPermission('manage_cryptocurrencies'), deleteCryptocurrency);

// Enable/Disable Cryptocurrency
router.put('/:id', verifyToken, checkPermission('manage_cryptocurrencies'), updateCryptocurrency);

module.exports = router;
