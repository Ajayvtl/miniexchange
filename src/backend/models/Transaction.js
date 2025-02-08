const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Optional: for user tracking
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cryptocurrency: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
            allowNull: false,
        },
        details: {
            type: DataTypes.JSON, // Store additional transaction metadata
        },
    },
    {
        timestamps: true, // Enable Sequelize's timestamps
        createdAt: 'created_at', // Map Sequelize's createdAt to created_at
        updatedAt: 'updated_at', // Map Sequelize's updatedAt to updated_at
    }
);


module.exports = Transaction;
