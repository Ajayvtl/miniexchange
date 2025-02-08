const { Cryptocurrency } = require('../models');
const { insertAuditLog } = require('../utils/logger');

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
            rpc_url,
            contract_address,
            symbol_link,
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
            rpc_url,
            contract_address,
            symbol_link,
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


