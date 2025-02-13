const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AppUser = sequelize.define("AppUser", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    encrypted_passkey: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
});

module.exports = AppUser;
