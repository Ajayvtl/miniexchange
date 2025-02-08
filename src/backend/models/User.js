const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    country_id: { type: DataTypes.INTEGER, defaultValue: null },
    timezone: { type: DataTypes.STRING, defaultValue: 'UTC' },
    kyc_status: { type: DataTypes.ENUM('pending', 'verified', 'rejected'), defaultValue: 'pending' },
    last_login_ip: { type: DataTypes.STRING },
    vpn_detected: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_enabled: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

module.exports = User;
