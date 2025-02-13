const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WalletType = require('./WalletType'); // ✅ Ensure WalletType is imported
const WalletAddress = sequelize.define('WalletAddress', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    wallet_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    wallet_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isEvmCompatible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    encrypted_passkey: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    backup: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
WalletAddress.belongsTo(WalletType, { foreignKey: 'wallet_type_id', as: 'walletType' });
module.exports = WalletAddress;
