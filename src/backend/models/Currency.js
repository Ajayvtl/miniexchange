const { Cryptocurrency } = require("../models");

/**
 * Get All Cryptocurrencies
 */
exports.getAllCryptocurrencies = async (req, res) => {
    try {
        const cryptos = await Cryptocurrency.findAll();
        res.status(200).json({ message: "Cryptocurrencies retrieved successfully", data: cryptos });
    } catch (error) {
        console.error("❌ Error fetching cryptocurrencies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Add New Cryptocurrency
 */
exports.addCryptocurrency = async (req, res) => {
    try {
        const { name, symbol, type, api_provider, api_url, client_ids } = req.body;

        const newCrypto = await Cryptocurrency.create({
            name,
            symbol,
            type,
            api_provider,
            api_url,
            client_ids: JSON.stringify(client_ids || ["1"])
        });

        res.status(201).json({ message: "Cryptocurrency added successfully", data: newCrypto });
    } catch (error) {
        console.error("❌ Error adding cryptocurrency:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Update Cryptocurrency Details
 */
exports.updateCryptocurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, symbol, api_provider, api_url, client_ids } = req.body;

        const crypto = await Cryptocurrency.findByPk(id);
        if (!crypto) return res.status(404).json({ error: "Cryptocurrency not found" });

        await crypto.update({
            name,
            symbol,
            api_provider,
            api_url,
            client_ids: JSON.stringify(client_ids)
        });

        res.status(200).json({ message: "Cryptocurrency updated successfully" });
    } catch (error) {
        console.error("❌ Error updating cryptocurrency:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Delete Cryptocurrency
 */
exports.deleteCryptocurrency = async (req, res) => {
    try {
        const { id } = req.params;

        const crypto = await Cryptocurrency.findByPk(id);
        if (!crypto) return res.status(404).json({ error: "Cryptocurrency not found" });

        await crypto.destroy();
        res.status(200).json({ message: "Cryptocurrency deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting cryptocurrency:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
