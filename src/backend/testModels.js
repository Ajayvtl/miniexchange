const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');

const Cryptocurrency = sequelize.define('Cryptocurrency', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    evmCompatible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rpcUrl: {
        type: DataTypes.STRING(255),
    },
    chainId: {
        type: DataTypes.INTEGER,
    },
    contractAddress: {
        type: DataTypes.STRING(255),
    },
    type: {
        type: DataTypes.ENUM('Token', 'Coin'),
        allowNull: false,
    },
    explorerUrl: {
        type: DataTypes.STRING(255),
    },
    transactionApi: {
        type: DataTypes.STRING(255),
    },
    apiKey: {
        type: DataTypes.STRING(255),
    },
});

module.exports = Cryptocurrency;
