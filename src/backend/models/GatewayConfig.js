const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GatewayConfig = sequelize.define("GatewayConfig", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    enabled: { type: DataTypes.TINYINT, defaultValue: 1 }, // 1 = Active, 0 = Disabled
    config: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() { // Automatically parse JSON when retrieving
            const rawValue = this.getDataValue("config");
            return rawValue ? JSON.parse(rawValue) : {};
        },
        set(value) { // Ensure JSON string is stored correctly
            this.setDataValue("config", JSON.stringify(value));
        }
    }
}, {
    timestamps: true,
    tableName: "gateway_config",
});

module.exports = GatewayConfig;
