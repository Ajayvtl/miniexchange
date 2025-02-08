const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { getGateways, updateGatewayStatus, updateGatewayConfig } = require('../controllers/adminController');
const router = express.Router();

router.get('/gateways', verifyToken, verifyAdmin, getGateways); // Fetch all gateways (Admin only)
router.put('/gateways/:id', verifyToken, verifyAdmin, updateGatewayStatus); // Enable/Disable gateway
router.put('/gateways/:id/config', verifyToken, verifyAdmin, updateGatewayConfig); // Update gateway API keys

module.exports = router;
