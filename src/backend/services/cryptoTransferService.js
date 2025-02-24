const axios = require("axios");

async function checkWalletBalance() {
    try {
        console.log("🔹 Checking USDT Wallet Balance...");
        const response = await axios.get("https://api.cryptoexchange.com/wallet/balance/usdt"); // Replace with real API
        return parseFloat(response.data.balance);
    } catch (error) {
        console.error("❌ Error checking balance:", error);
        return 0;
    }
}

async function sendUSDT(walletAddress, amount) {
    try {
        console.log(`🔹 Initiating USDT Transfer: ${amount} USDT to ${walletAddress}...`);

        const response = await axios.post("https://api.cryptoexchange.com/wallet/transfer", {
            to: walletAddress,
            amount: amount,
            token: "USDT",
        });

        if (response.data.status === "success") {
            console.log(`✅ USDT Sent Successfully. TX Hash: ${response.data.transaction_hash}`);
            return response.data.transaction_hash;
        } else {
            console.error("❌ Transfer Failed:", response.data.message);
            return null;
        }
    } catch (error) {
        console.error("❌ Error sending USDT:", error);
        return null;
    }
}

module.exports = { sendUSDT, checkWalletBalance };
