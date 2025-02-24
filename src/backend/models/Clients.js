const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Client = sequelize.define("Client", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    app_enabled: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    package_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    client_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    client_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    added_by: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    enabled: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "USD"
    },
    country_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gst: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bank_details: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "clients",
    timestamps: true
});

module.exports = Client;
