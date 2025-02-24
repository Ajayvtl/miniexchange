const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Cryptocurrency = require('./Cryptocurrency');
const Transaction = require('./Transaction');
// const GatewayConfigs = require('./gatewayConfig');
const AppUser = require('./AppUser'); // ✅ Ensure AppUser is imported
const WalletAddress = require('./WalletAddress');
const WalletType = require('./WalletType');
const GatewayConfig = require('./GatewayConfig');
// ✅ Define relationships
Role.hasMany(User, { foreignKey: 'role_id', onDelete: 'CASCADE' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// ✅ Many-to-Many Relationship for Permissions & Roles
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

// ✅ Define Relationship: User ↔ AppUser
User.hasMany(AppUser, { foreignKey: 'user_id', onDelete: 'CASCADE' });
AppUser.belongsTo(User, { foreignKey: 'user_id' });
AppUser.hasMany(WalletAddress, { foreignKey: 'app_user_id', onDelete: 'CASCADE' });
WalletAddress.belongsTo(AppUser, { foreignKey: 'app_user_id' });

WalletAddress.belongsTo(WalletType, { foreignKey: 'wallet_type_id' });
WalletType.hasMany(WalletAddress, { foreignKey: 'wallet_type_id' });
// ✅ Export All Models
module.exports = {
    sequelize,
    User,
    Role,
    Permission,
    RolePermission,
    Cryptocurrency,
    Transaction,
    // GatewayConfigs,
    AppUser, // ✅ Ensure AppUser is included in exports
    WalletAddress,
    WalletType,
    GatewayConfig,
};
