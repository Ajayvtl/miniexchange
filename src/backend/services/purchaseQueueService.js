const { PaymentTransaction, WalletAddress } = require("../models");
const { sendUSDT, checkWalletBalance } = require("./cryptoTransferService");

const purchaseQueue = [];

async function processQueue() {
    while (purchaseQueue.length > 0) {
        const { walletAddress, amount, transactionId } = purchaseQueue.shift();

        // ✅ Check USDT balance before sending
        const balance = await checkWalletBalance();
        if (balance < 50) {
            console.error("❌ Low Balance. Pausing transactions.");
            return;
        }

        console.log(`✅ Sending ${amount} USDT to ${walletAddress}`);
        const txHash = await sendUSDT(walletAddress, amount);

        if (txHash) {
            console.log(`✅ Transaction Successful: ${txHash}`);
            await PaymentTransaction.update(
                { status: "Completed", transaction_hash: txHash },
                { where: { id: transactionId } }
            );
        } else {
            console.error("❌ USDT Transfer Failed. Retrying in next cycle.");
            purchaseQueue.push({ walletAddress, amount, transactionId });
        }
    }
}

// ✅ Function to add purchases to the queue
async function queuePurchase(walletAddress, amount, transactionId) {
    purchaseQueue.push({ walletAddress, amount, transactionId });
    if (purchaseQueue.length === 1) {
        processQueue();
    }
}

module.exports = { queuePurchase };
