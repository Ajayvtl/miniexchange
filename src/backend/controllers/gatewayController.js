const { GatewayConfig } = require('../models');
const { insertAuditLog } = require('../utils/logger');

exports.getGateways = async (req, res) => {
    try {
        const gateways = await GatewayConfig.findAll();
        res.status(200).json(gateways);
    } catch (error) {
        console.error('Error fetching gateways:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateGatewayConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { config, enabled } = req.body;

        const gateway = await GatewayConfig.findByPk(id);
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        await gateway.update({ config, enabled });

        await insertAuditLog(req.user.id, id, 'Updated gateway configuration');
        res.status(200).json({ message: 'Gateway configuration updated successfully' });
    } catch (error) {
        console.error('Error updating gateway configuration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateGatewayStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;

        const gateway = await GatewayConfig.findByPk(id);
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        await gateway.update({ enabled });

        await insertAuditLog(req.user.id, id, `Gateway ${enabled ? 'enabled' : 'disabled'}`);
        res.status(200).json({ message: `Gateway ${enabled ? 'enabled' : 'disabled'} successfully` });
    } catch (error) {
        console.error('Error updating gateway status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};