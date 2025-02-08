const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    }
}, {
    timestamps: false,  // No createdAt/updatedAt timestamps needed
    tableName: 'role_permissions'  // Maps directly to the existing SQL table
});

module.exports = RolePermission;
