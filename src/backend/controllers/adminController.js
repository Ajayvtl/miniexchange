const { GatewayConfig } = require('../models');

exports.getGateways = async (req, res) => {
    try {
        const gateways = await GatewayConfig.findAll();
        res.status(200).json(gateways);
    } catch (error) {
        console.error('Error fetching gateways:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateGatewayStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;

        if (enabled === undefined) {
            return res.status(400).json({ message: '"enabled" field is required' });
        }

        const result = await GatewayConfig.update({ enabled }, { where: { id } });

        if (result[0] === 0) {
            return res.status(404).json({ message: 'Gateway not found or no changes made' });
        }

        res.status(200).json({ message: 'Gateway status updated successfully' });
    } catch (error) {
        console.error('Error updating gateway status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.updateGatewayConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { config } = req.body;

        if (!config) {
            return res.status(400).json({ message: '"config" field is required' });
        }

        const result = await GatewayConfig.update({ config: JSON.stringify(config) }, { where: { id } });

        if (result[0] === 0) {
            return res.status(404).json({ message: 'Gateway not found or no changes made' });
        }

        res.status(200).json({ message: 'Gateway configuration updated successfully' });
    } catch (error) {
        console.error('Error updating gateway config:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

