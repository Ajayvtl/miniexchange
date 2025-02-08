const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WalletAddress = sequelize.define('WalletAddress', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    walletAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    walletTypeId: {
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
    encryptedPasskey: {
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
WalletAddress.belongsTo(WalletType, { foreignKey: 'walletTypeId', as: 'walletType' });
module.exports = WalletAddress;
