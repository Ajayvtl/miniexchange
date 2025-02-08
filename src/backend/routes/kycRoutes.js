const express = require('express');
const { submitKycDocument, updateKycStatus } = require('../controllers/kycController');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/submit', verifyToken, submitKycDocument);
router.put('/status', verifyToken, checkPermission('Manage KYC'), updateKycStatus);

module.exports = router;
