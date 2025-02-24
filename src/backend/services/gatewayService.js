const axios = require("axios");
const { GatewayConfig } = require('../models');
const stripeService = require('./stripeService');
const paypalService = require('./paypalService');

const availableGateways = {
    stripe: stripeService,
    paypal: paypalService,
};

// ✅ Fetch Enabled Payment Gateway
exports.getGateway = async (gatewayName) => {
    try {
        console.log(`🔹 Fetching Payment Gateway: ${gatewayName}`);

        const gateway = await GatewayConfig.findOne({ where: { name: gatewayName, enabled: 1 } });

        if (!gateway || !availableGateways[gatewayName]) {
            console.log(`❌ Gateway ${gatewayName} is not available or disabled.`);
            return null;
        }

        console.log(`✅ Gateway ${gatewayName} is active.`);
        return { ...gateway.toJSON(), service: availableGateways[gatewayName] };
    } catch (error) {
        console.error("❌ Error fetching gateway:", error);
        return null;
    }
};

exports.logPayment = async (paymentDetails) => {
    try {
        const { userId, gatewayName, gatewayPaymentId, amount, currency, paymentType, status, description } = paymentDetails;
        console.log("🔹 Logging Payment Transaction...");
        await GatewayConfig.sequelize.query(
            `
            INSERT INTO payments (user_id, gateway_name, gateway_payment_id, amount, currency, payment_type, status, description, created_at, updated_at)
            VALUES (:userId, :gatewayName, :gatewayPaymentId, :amount, :currency, :paymentType, :status, :description, NOW(), NOW())
            `,
            {
                replacements: { userId, gatewayName, gatewayPaymentId, amount, currency, paymentType, status, description },
            }
        );
        console.log("✅ Payment logged successfully.");
    } catch (error) {
        console.error("❌ Error logging payment:", error);
    }
};

// ✅ Correctly define and export the function
const getUSDTPriceWithMarkup = async (symbol = "USDTBUSD", markupPercentage = 2) => {
    try {
        console.log(`🔹 Fetching Live Price for ${symbol}...`);

        // Fetch live price
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const livePrice = parseFloat(response.data.price);

        // Apply dynamic markup
        const markupFactor = 1 + markupPercentage / 100;
        const priceWithMarkup = livePrice * markupFactor;

        console.log(`✅ Live ${symbol} Price: ${livePrice}, Adjusted Price: ${priceWithMarkup}`);
        return priceWithMarkup;
    } catch (error) {
        console.error(`❌ Error fetching ${symbol} price:`, error);
        return null;
    }
};

module.exports = {
    getUSDTPriceWithMarkup,
    getGateway: exports.getGateway,
    logPayment: exports.logPayment,
};
