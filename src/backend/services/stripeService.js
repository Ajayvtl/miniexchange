const { GatewayConfig } = require('../models');
const stripeService = require('./stripeService');
const paypalService = require('./paypalService');

const gateways = {
    stripe: stripeService,
    paypal: paypalService,
};

exports.getGateway = async (gatewayName) => {
    const gateway = await GatewayConfig.findOne({ where: { name: gatewayName } });
    if (!gateway || !gateways[gatewayName]) {
        return null;
    }
    return { ...gateway, service: gateways[gatewayName] };
};

exports.logPayment = async (paymentDetails) => {
    // Insert payment details into the database
    const { userId, gatewayName, gatewayPaymentId, amount, currency, paymentType, status, description } = paymentDetails;
    await sequelize.query(
        `
    INSERT INTO payments (user_id, gateway_name, gateway_payment_id, amount, currency, payment_type, status, description, created_at, updated_at)
    VALUES (:userId, :gatewayName, :gatewayPaymentId, :amount, :currency, :paymentType, :status, :description, NOW(), NOW())
    `,
        {
            replacements: { userId, gatewayName, gatewayPaymentId, amount, currency, paymentType, status, description },
        }
    );
};
