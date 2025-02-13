const { WalletType } = require('../models');

// ✅ Create a new wallet type
exports.createWalletType = async (req, res) => {
    try {
        const { name, enabled, block, visibleToUser } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Wallet type name is required" });
        }

        const walletType = await WalletType.create({ name, enabled, block, visibleToUser });
        res.status(201).json({ message: 'Wallet type created successfully', walletType });
    } catch (error) {
        console.error('Error creating wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// ✅ Get all wallet types
exports.getAllWalletTypes = async (req, res) => {
    try {
        const walletTypes = await WalletType.findAll();
        res.status(200).json(walletTypes);
    } catch (error) {
        console.error('Error fetching wallet types:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// ✅ Get a wallet type by ID
exports.getWalletTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const walletType = await WalletType.findByPk(id);

        if (!walletType) {
            return res.status(404).json({ message: 'Wallet type not found' });
        }

        res.status(200).json(walletType);
    } catch (error) {
        console.error('Error fetching wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// ✅ Update a wallet type
exports.updateWalletType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, enabled, block, visibleToUser } = req.body;

        const walletType = await WalletType.findByPk(id);
        if (!walletType) {
            return res.status(404).json({ message: 'Wallet type not found' });
        }

        await walletType.update({ name, enabled, block, visibleToUser });

        res.status(200).json({ message: 'Wallet type updated successfully', walletType });
    } catch (error) {
        console.error('Error updating wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// ✅ Delete a wallet type
exports.deleteWalletType = async (req, res) => {
    try {
        const { id } = req.params;

        const walletType = await WalletType.findByPk(id);
        if (!walletType) {
            return res.status(404).json({ message: 'Wallet type not found' });
        }

        await walletType.destroy();
        res.status(200).json({ message: 'Wallet type deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
