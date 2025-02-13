const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WalletType = sequelize.define('WalletType', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    block: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    visible_to_user: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'wallet_types'
});

module.exports = WalletType;
