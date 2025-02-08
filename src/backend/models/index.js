const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Cryptocurrency = require('./Cryptocurrency'); // Cryptocurrency model
const Transaction = require('./Transaction'); // Transaction model
const GatewayConfig = require('../config/GatewayConfig');

// Define relationships
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'CASCADE' });
User.belongsTo(Role, { foreignKey: 'role_id' });

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    onDelete: 'CASCADE',
});
Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    onDelete: 'CASCADE',
});

module.exports = {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Cryptocurrency,
    Transaction,
    GatewayConfig,
};
