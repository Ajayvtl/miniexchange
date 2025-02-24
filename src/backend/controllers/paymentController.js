const { getUSDTPriceWithMarkup, getGateway } = require("../services/gatewayService");
const { GatewayConfig, Transaction, WalletAddress, User } = require("../models");
const { insertAuditLog } = require('../utils/logger');
const { Payment } = require('../models');
const { createPaymentIntent } = require('../services/stripeService');
const { getLiveCryptoRatesInternal } = require('../controllers/cryptoController');
const { queuePurchase } = require("../services/purchaseQueueService");
const axios = require('axios');
exports.createPayment = async (req, res) => {
    try {
        const { amount, currency, paymentType, description, gatewayName } = req.body;

        const gateway = await gatewayService.getGateway(gatewayName);
        if (!gateway || !gateway.enabled) {
            return res.status(400).json({ message: `Payment gateway ${gatewayName} is not available` });
        }

        const paymentResult = await gateway.service.createPayment(amount, currency, description, paymentType);

        await Payment.create({
            userId: req.user.id,
            gatewayName,
            gatewayPaymentId: paymentResult.paymentId,
            amount,
            currency,
            paymentType,
            status: 'pending',
            description,
        });

        res.status(200).json({ clientSecret: paymentResult.clientSecret });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateRolePermissions = async (req, res) => {
    try {
        const { roleId, permissions } = req.body; // Expecting an array of permission IDs

        // Find the role
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Update role permissions dynamically using Sequelize's built-in association management
        await role.setPermissions(permissions);

        res.status(200).json({ message: 'Permissions updated successfully for the role' });
    } catch (error) {
        console.error('Error updating role permissions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getEnabledGateways = async (req, res) => {
    try {
        console.log("🔹 Fetching Enabled Payment Gateways...");

        const gateways = await GatewayConfig.findAll({
            where: { enabled: 1 },
            attributes: ["id", "name", "config"],
        });

        if (!gateways.length) {
            console.log("❌ No active payment gateways found.");
            return res.status(404).json({ error: "No active payment gateways available." });
        }

        console.log(`✅ Retrieved ${gateways.length} active payment gateways.`);
        res.status(200).json({ gateways });
    } catch (error) {
        console.error("❌ Error fetching gateways:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
// ✅ Buy USDT Controller
exports.buyUSDT = async (req, res) => {
    try {
        console.log("🔹 Initiating USDT Purchase...");

        const { amount, gatewayId } = req.body;
        if (!amount || !gatewayId) {
            return res.status(400).json({ error: "Missing required fields: amount or gatewayId." });
        }

        // ✅ Fetch live crypto rates using the correct function
        const ratesResponse = await getLiveCryptoRatesInternal();
        if (!ratesResponse || !ratesResponse.rates) {
            console.log("❌ Error fetching rates.");
            return res.status(500).json({ error: "Failed to fetch crypto rates." });
        }

        console.log("✅ Updated Internal Rates:", ratesResponse.rates);

        // ✅ Ensure `ratesResponse.rates` is an array
        const ratesArray = Array.isArray(ratesResponse.rates) ? ratesResponse.rates : Object.values(ratesResponse.rates);

        // ✅ Find USDT rate correctly
        const usdtRate = ratesArray.find((r) => r.symbol === "USDT");

        if (!usdtRate || !usdtRate.price_usd) {
            console.log("❌ USDT Rate not found in response:", ratesArray);
            return res.status(500).json({ error: "USDT price not found." });
        }

        const priceWithMarkup = usdtRate.price_usd * 1.02; // ✅ 2% Markup
        const totalCost = amount * priceWithMarkup;

        console.log(`✅ USDT Price: ${usdtRate.price_usd}, Adjusted Price: ${priceWithMarkup}, Total Cost: ${totalCost}`);

        // ✅ Proceed with payment processing (integrate with Stripe/PayPal)
        res.status(200).json({ message: "USDT Purchase Successful", totalCost });
    } catch (error) {
        console.error("❌ Error processing USDT buy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


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

            // ✅ Queue USDT Transfer
            queuePurchase(wallet.wallet_address, transaction.amount, transaction.id);

            res.status(200).json({ message: "USDT Transfer Queued." });
        } else {
            console.log("⚠️ Unhandled Stripe Event:", event.type);
        }
    } catch (error) {
        console.error("❌ Error handling Stripe Webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




