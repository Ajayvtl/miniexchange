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
    visibleToUser: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = WalletType;
