const { Cryptocurrency } = require('../models');
const { insertAuditLog } = require('../utils/logger');
const axios = require('axios');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');
const cache = new NodeCache({ stdTTL: 60 }); // Cache TTL: 60 seconds
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const RATE_FILE_PATH = path.join(__dirname, '../data/cryptoRates.json');
let lastUpdatedTime = 0;
const RATE_UPDATE_THRESHOLD = 10000;
// Add Cryptocurrency
exports.addCryptocurrency = async (req, res) => {
    try {
        const {
            name,
            symbol,
            type = 'Coin',  // Default value to 'Coin'
            rate_limit_per_second = 0,
            rate_limit_per_minute = 0,
            api_key,
            api_provider,
            api_url,
            rpc_url,
            contract_address,
            symbol_link,
            chain_id,
            network_name,
            explorer_url,
            enabled = 1
        } = req.body;

        // Basic validation for required fields
        if (!name || !symbol) {
            return res.status(400).json({ message: 'Name and symbol are required' });
        }

        // Check for duplicates before inserting
        const existingCrypto = await Cryptocurrency.findOne({ where: { name } });
        if (existingCrypto) {
            return res.status(409).json({ message: 'Cryptocurrency already exists' });
        }

        // Insert new cryptocurrency
        const newCrypto = await Cryptocurrency.create({
            name,
            symbol,
            type,
            rate_limit_per_second,
            rate_limit_per_minute,
            api_key,
            api_provider,
            api_url,
            rpc_url,
            contract_address,
            symbol_link,
            chain_id,
            network_name,
            explorer_url,
            enabled
        });

        // Log the addition of a new cryptocurrency
        await insertAuditLog(req.user.id, newCrypto.id, 'Cryptocurrency Added');

        res.status(201).json({ message: 'Cryptocurrency added successfully', newCrypto });
    } catch (error) {
        console.error('Error adding cryptocurrency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Cryptocurrencies
exports.getCryptocurrencies = async (req, res) => {
    try {
        const cryptocurrencies = await Cryptocurrency.findAll();
        res.status(200).json(cryptocurrencies);
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Cryptocurrency
exports.deleteCryptocurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const cryptoToDelete = await Cryptocurrency.findByPk(id);

        if (!cryptoToDelete) {
            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }

        await Cryptocurrency.destroy({ where: { id } });

        // Log the action
        await insertAuditLog(req.user.id, id, 'Cryptocurrency Deleted');

        res.status(200).json({ message: 'Cryptocurrency deleted successfully' });
    } catch (error) {
        console.error('Error deleting cryptocurrency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update Cryptocurrency by ID
exports.updateCryptocurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            symbol,
            type,
            rate_limit_per_second,
            rate_limit_per_minute,
            api_key,
            api_provider,
            rpc_url,
            contract_address,
            symbol_link,
            enabled
        } = req.body;

        const crypto = await Cryptocurrency.findByPk(id);
        if (!crypto) {
            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }

        await crypto.update({
            name,
            symbol,
            type,
            rate_limit_per_second,
            rate_limit_per_minute,
            api_key,
            api_provider,
            rpc_url,
            contract_address,
            symbol_link,
            enabled
        });

        res.status(200).json({ message: 'Cryptocurrency updated successfully', crypto });
    } catch (error) {
        console.error('Error updating cryptocurrency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Background job to update rates every 10 seconds
// Function to fetch and update rates on-demand
async function fetchAndUpdateRates() {
    try {
        console.log('Attempting to update rates at', new Date().toISOString());

        // Fetch enabled cryptocurrencies
        const cryptocurrencies = await Cryptocurrency.findAll({ where: { enabled: 1 } });
        if (cryptocurrencies.length === 0) {
            console.warn('No enabled cryptocurrencies found');
            return;
        }

        // Prepare API request for supported cryptocurrencies
        const coinIds = cryptocurrencies.map(crypto => crypto.name.toLowerCase()).join(',');

        try {
            const response = await axios.get(`${COINGECKO_API_URL}?ids=${coinIds}&vs_currencies=usd`);

            // Format the response
            const rates = cryptocurrencies.map(crypto => ({
                symbol: crypto.symbol,
                price_usd: response.data[crypto.name.toLowerCase()]?.usd || 'N/A'
            }));

            // Write the rates to a JSON file
            fs.writeFileSync(RATE_FILE_PATH, JSON.stringify(rates, null, 2));
            lastUpdatedTime = Date.now();

            console.log('Rates updated successfully at', new Date().toISOString());
        } catch (apiError) {
            if (apiError.response && apiError.response.status === 429) {
                const retryAfter = apiError.response.headers['retry-after'] || 10;
                console.warn(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
                setTimeout(fetchAndUpdateRates, retryAfter * 1000);
            } else {
                throw apiError;
            }
        }
    } catch (error) {
        console.error('Critical error updating rates:', error);
    }
}

// // Background job to check and update rates if needed every 10 seconds
// setInterval(() => {
//     if (Date.now() - lastUpdatedTime >= 10000) {
//         fetchAndUpdateRates();
//     }
// }, 10000);


// GET /cryptocurrency/rates
exports.getLiveCryptoRates = async (req, res) => {
    try {
        // Check if rates were updated within the last 10 seconds
        const currentTime = Date.now();
        if (currentTime - lastUpdatedTime < 10000 && fs.existsSync(RATE_FILE_PATH)) {
            const cachedRates = JSON.parse(fs.readFileSync(RATE_FILE_PATH, 'utf-8'));
            console.log('Returning cached rates.');
            return res.status(200).json({ success: true, rates: cachedRates });
        }

        // Trigger an update if rates are outdated
        console.log('Rates outdated, fetching new rates.');
        await fetchAndUpdateRates();

        // Return the newly updated rates
        const updatedRates = JSON.parse(fs.readFileSync(RATE_FILE_PATH, 'utf-8'));
        console.log("✅ Updated Rates:", updatedRates);
        return res.status(200).json({ success: true, rates: updatedRates });
    } catch (error) {
        console.error('Error fetching live rates:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch live rates' });
    }
};
exports.getLiveCryptoRatesInternal = async () => {
    try {
        console.log("🔹 Fetching Internal Crypto Rates...");

        // ✅ Check if rates are outdated
        const currentTime = Date.now();
        if (fs.existsSync(RATE_FILE_PATH)) {
            const cachedRates = JSON.parse(fs.readFileSync(RATE_FILE_PATH, "utf-8"));
            const lastUpdatedTime = fs.statSync(RATE_FILE_PATH).mtimeMs;

            if (currentTime - lastUpdatedTime < RATE_UPDATE_THRESHOLD) {
                console.log("✅ Returning Cached Crypto Rates.");
                return { success: true, rates: cachedRates };
            }
        }

        // ✅ If outdated, update rates
        console.log("🔹 Rates outdated, updating...");
        await fetchAndUpdateRates();

        // ✅ Read updated rates
        const updatedRates = JSON.parse(fs.readFileSync(RATE_FILE_PATH, "utf-8"));
        console.log("✅ Updated Internal Rates:", updatedRates);

        return { success: true, rates: updatedRates };
    } catch (error) {
        console.error("❌ Error fetching Internal Crypto Rates:", error);
        return { success: false, message: "Failed to fetch crypto rates." };
    }
};