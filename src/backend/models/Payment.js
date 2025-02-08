const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gatewayName: { type: DataTypes.STRING, allowNull: false },
    gatewayPaymentId: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    paymentType: { type: DataTypes.ENUM('one-time', 'subscription'), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), allowNull: false },
    description: { type: DataTypes.TEXT },
});

module.exports = Payment;
