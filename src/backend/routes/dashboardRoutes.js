const express = require('express');
const { verifyToken, checkPermission } = require('../middlewares/authMiddleware');
const { User, Cryptocurrency, Transaction } = require('../models');

const router = express.Router();

// Dynamic /dashboard route
router.get('/dashboard', verifyToken, checkPermission('Admin'), async (req, res) => {
    try {
        const totalUsers = await User.count(); // Count total users
        const totalCryptocurrencies = await Cryptocurrency.count(); // Count total cryptocurrencies
        const recentTransactions = await Transaction.findAll({
            limit: 3,
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({
            message: 'Welcome to the dashboard',
            stats: {
                totalUsers,
                totalCryptocurrencies,
                recentTransactions,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
