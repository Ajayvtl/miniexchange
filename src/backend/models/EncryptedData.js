const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EncryptedData = sequelize.define('EncryptedData', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    encryptedPrivateKey: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    encryptedUserPasskey: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = EncryptedData;
