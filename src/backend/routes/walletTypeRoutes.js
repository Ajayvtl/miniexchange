const express = require('express');
const { WalletType } = require('../models');

const router = express.Router();

// Add Wallet Type
router.post('/', async (req, res) => {
    try {
        const { name, enabled, block, visibleToUser } = req.body;
        const walletType = await WalletType.create({ name, enabled, block, visibleToUser });
        res.status(201).json({ message: 'Wallet type created successfully', walletType });
    } catch (error) {
        console.error('Error creating wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Wallet Types
router.get('/', async (req, res) => {
    try {
        const walletTypes = await WalletType.findAll();
        res.status(200).json(walletTypes);
    } catch (error) {
        console.error('Error fetching wallet types:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update Wallet Type
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, enabled, block, visibleToUser } = req.body;

        await WalletType.update(
            { name, enabled, block, visibleToUser },
            { where: { id } }
        );

        res.status(200).json({ message: 'Wallet type updated successfully' });
    } catch (error) {
        console.error('Error updating wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete Wallet Type
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await WalletType.destroy({ where: { id } });
        res.status(200).json({ message: 'Wallet type deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet type:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
