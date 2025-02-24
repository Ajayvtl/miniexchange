const fs = require("fs");
const path = require("path");
const transactionSyncService = require("../services/transactionSyncService");

const TRANSACTION_FILE = path.join(__dirname, "../data/transactions.json");

// **🔹 Main API Route - GET /transactions**
exports.getTransactions = async (req, res) => {
    try {
        console.log("🔹 Fetching transactions for user...");

        const { walletAddress, networkName, clientId, symbol } = req.body;
        console.log(walletAddress);
        console.log(networkName);
        console.log(clientId);
        console.log(symbol);
        if (!walletAddress || !networkName || !clientId || !symbol) {
            return res.status(400).json({ error: "Missing required parameters: walletAddress, networkName, clientId" });
        }

        // ✅ Call the function properly
        const transactions = await transactionSyncService.fetchTransactions(walletAddress, networkName, clientId, symbol);

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }

        res.status(200).json({ message: "Transactions retrieved successfully", transactions });
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
