const { GatewayConfig } = require('../models');

const fetchGateways = async () => {
    try {
        const gateways = await GatewayConfig.findAll();

        // Convert database entries into an object
        const gatewayObject = {};
        gateways.forEach((gateway) => {
            gatewayObject[gateway.name] = {
                enabled: gateway.enabled,
                ...JSON.parse(gateway.config),
            };
        });

        return gatewayObject;
    } catch (error) {
        console.error('Error fetching gateways:', error);
        throw new Error('Failed to fetch gateway configurations');
    }
};

module.exports = { fetchGateways };
