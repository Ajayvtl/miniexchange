const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const paymentController = require("../controllers/paymentController");
const { authenticateAppUser } = require("../middlewares/authMiddleware")
const router = express.Router();
// ✅ Ensure the function `getEnabledGateways` exists before using it
if (typeof paymentController.getEnabledGateways !== "function") {
    console.error("❌ ERROR: `getEnabledGateways` function is missing in `paymentController.js`");
} else {
    router.get("/gateways", authenticateAppUser, paymentController.getEnabledGateways);
}
router.post('/', verifyToken, createPayment);
router.post("/buy-usdt", authenticateAppUser, paymentController.buyUSDT);
router.get("/gateways", authenticateAppUser, paymentController.getEnabledGateways);
module.exports = router;
