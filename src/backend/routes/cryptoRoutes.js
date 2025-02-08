const express = require('express');
const { Cryptocurrency } = require('../models');

const router = express.Router();

// Add Cryptocurrency
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const cryptocurrency = await Cryptocurrency.create(data);
        res.status(201).json({ message: 'Cryptocurrency added successfully', cryptocurrency });
    } catch (error) {
        console.error('Error adding cryptocurrency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Cryptocurrencies
router.get('/', async (req, res) => {
    try {
        const cryptocurrencies = await Cryptocurrency.findAll();
        res.status(200).json(cryptocurrencies);
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete Cryptocurrency
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Cryptocurrency.destroy({ where: { id } });
        res.status(200).json({ message: 'Cryptocurrency deleted successfully' });
    } catch (error) {
        console.error('Error deleting cryptocurrency:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
