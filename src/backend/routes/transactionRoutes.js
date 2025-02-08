const express = require('express');
const { Transaction } = require('../models');

const router = express.Router();

// Get all transactions with optional filters
router.get('/', async (req, res) => {
    try {
        const { status, cryptocurrency } = req.query;

        const where = {};
        if (status) where.status = status;
        if (cryptocurrency) where.cryptocurrency = cryptocurrency;

        const transactions = await Transaction.findAll({ where });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
