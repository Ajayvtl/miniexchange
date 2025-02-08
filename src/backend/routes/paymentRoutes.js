const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createPayment);

module.exports = router;
