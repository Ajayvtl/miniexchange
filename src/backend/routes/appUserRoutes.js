const express = require("express");
const router = express.Router();
const appUserController = require("../controllers/appUserController");
const { authenticateAppUser } = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");
const transactionController = require("../controllers/transactionController");
const cryptocurrencies = require("../controllers/cryptoController");
// ✅ Verify `listUserWallets` exists before using
if (!appUserController.listUserWallets) {
    console.error("❌ ERROR: listUserWallets is not defined in appUserController");
}
// ✅ Ensure the function `getEnabledGateways` exists before using it
if (typeof paymentController.getEnabledGateways !== "function") {
    console.error("❌ ERROR: `getEnabledGateways` function is missing in `paymentController.js`");
} else {
    router.get("/gateways", authenticateAppUser, paymentController.getEnabledGateways);
}
console.log("Checking appUserController:", appUserController);
// console.log("listUserWallets:", appUserController.listUserWallets);//checked
// console.log("updateWallet:", appUserController.updateWallet);//cheked
// router.put("/user/:userId/wallets/:walletId", authenticateAppUser, appUserController.updateWallet);//not required
console.log("logoutUser:", appUserController.logoutUser);
router.post("/register", appUserController.registerAppUser); //cheked
router.get("/user/:userId/wallets", authenticateAppUser, appUserController.listUserWallets);//checked
router.post("/refresh-token", appUserController.refreshToken);
router.post("/user/wallets/restore", appUserController.restoreWallet);//checked
router.post("/user/logout", authenticateAppUser, appUserController.logoutUser);
router.post("/register-wallet", appUserController.registerWallet);//cheked
router.get("/cryptos", authenticateAppUser, appUserController.getCryptoList);
router.post("/transactions", authenticateAppUser, transactionController.getTransactions);
//paymentgatway
router.post("/buy-usdt", authenticateAppUser, paymentController.buyUSDT);
router.get("/gateways", authenticateAppUser, paymentController.getEnabledGateways);
router.get('/live-rates', authenticateAppUser, cryptocurrencies.getLiveCryptoRates);
router.get('/2/cryptolist', authenticateAppUser, cryptocurrencies.getCryptocurrencies);
module.exports = router;
