const express = require('express');
const { getGateways, updateGatewayConfig, updateGatewayStatus } = require('../controllers/gatewayController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, checkPermission('view_gateways'), getGateways);
router.put('/:id/config', verifyToken, checkPermission('manage_gateways'), updateGatewayConfig);
router.put('/:id/status', verifyToken, checkPermission('manage_gateways'), updateGatewayStatus); // Enable/Disable gateway
module.exports = router;
