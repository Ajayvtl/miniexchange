const { GatewayConfig } = require('../models');

// const fetchGateways = async () => {
//     try {
//         const gateways = await GatewayConfig.findAll();

//         // Convert database entries into an object
//         const gatewayObject = {};
//         gateways.forEach((gateway) => {
//             gatewayObject[gateway.name] = {
//                 enabled: gateway.enabled,
//                 ...JSON.parse(gateway.config),
//             };
//         });

//         return gatewayObject;
//     } catch (error) {
//         console.error('Error fetching gateways:', error);
//         throw new Error('Failed to fetch gateway configurations');
//     }
// };
exports.getUSDTPriceWithMarkup = async () => {
    try {
        console.log("🔹 Fetching Live USDT Price...");

        // ✅ Fetch price from Binance API
        const response = await axios.get("https://api.binance.com/api/v3/ticker/price?symbol=USDTBUSD");
        const livePrice = parseFloat(response.data.price);

        // ✅ Apply 2% markup
        const priceWithMarkup = livePrice * 1.02;

        console.log(`✅ Live USDT Price: ${livePrice}, Adjusted Price: ${priceWithMarkup}`);
        return priceWithMarkup;
    } catch (error) {
        console.error("❌ Error fetching USDT price:", error);
        throw new Error("Failed to fetch USDT price.");
    }
};
exports.getEnabledGateways = async (req, res) => {
    try {
        console.log("🔹 Fetching Enabled Payment Gateways...");

        // ✅ Fetch only enabled gateways
        const gateways = await GatewayConfig.findAll({
            where: { enabled: 1 },
            attributes: ["id", "name", "config"], // Fetching essential details
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
};

// module.exports = { fetchGateways };
