const { gatewayService } = require('../services/gatewayService');
const { insertAuditLog } = require('../utils/logger');
const { Payment } = require('../models');

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