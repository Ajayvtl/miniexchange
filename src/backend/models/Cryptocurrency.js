const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cryptocurrency = sequelize.define("Cryptocurrency", {
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
    type: {
        type: DataTypes.ENUM("Coin", "Token"),
        allowNull: false,
        defaultValue: "Coin",
    },
    rpc_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    contract_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    chain_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    network_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    explorer_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    rate_limit_per_second: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    rate_limit_per_minute: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    api_key: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    api_provider: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    symbol_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    enabled: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
    },
    decimals: {  // ✅ New column
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 18,
    }
}, {
    timestamps: true,
    tableName: "cryptocurrencies",
});

module.exports = Cryptocurrency;
