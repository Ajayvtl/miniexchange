const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables
console.log('Loaded Environment Variables:');
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
// Import routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const walletRoutes = require('./routes/walletRoutes');
const cryptocurrencyRoutes = require('./routes/cryptocurrencyRoutes');
const walletTypeRoutes = require('./routes/walletTypeRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // New
const adminRoutes = require('./routes/adminRoutes'); // New
const kycRoutes = require('./routes/kycRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wallet-types', walletTypeRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/cryptocurrencies', cryptocurrencyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payments', paymentRoutes); // Payment gateway routes
app.use('/api/admin', adminRoutes); // Admin gateway management routes
app.use('/api/kyc', kycRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/gateways', gatewayRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
// 404 Middleware for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
module.exports = app;
