const { PaymentTransaction, WalletAddress } = require('../models');

exports.stripeWebhook = async (req, res) => {
    try {
        const event = req.body;

        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object;
            console.log(`✅ Payment Successful: ${paymentIntent.id}`);

            const transaction = await PaymentTransaction.findOne({ where: { gateway_payment_id: paymentIntent.id } });
            if (!transaction) return res.status(404).json({ error: "Transaction not found" });

            // ✅ Find User Wallet
            const wallet = await WalletAddress.findOne({ where: { user_id: transaction.user_id } });
            if (!wallet) return res.status(404).json({ error: "Wallet not found" });

            // ✅ Ensure minimum 50 USDT remains
            const remainingBalance = await checkWalletBalance();
            if (remainingBalance < 50) {
                console.error("❌ Insufficient USDT in Reserve.");
                return res.status(500).json({ error: "Low USDT reserve. Contact Support." });
            }

            // ✅ Send USDT to User
            await sendUSDT(wallet.wallet_address, transaction.amount);

            // ✅ Update Transaction
            await transaction.update({ status: "Completed", transaction_hash: "0xabc123..." });

            res.status(200).json({ message: "USDT Sent Successfully." });
        } else {
            console.log("⚠️ Unhandled Stripe Event:", event.type);
        }
    } catch (error) {
        console.error("❌ Error handling Stripe Webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
