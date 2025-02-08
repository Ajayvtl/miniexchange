const sequelize = require('../config/database');

const insertAuditLog = async (userId, action, module = 'General', walletId = null) => {
    try {
        await sequelize.query(
            `INSERT INTO audit_logs (user_id, wallet_id, action, module, timestamp) 
             VALUES (:userId, :walletId, :action, :module, NOW())`,
            {
                replacements: {
                    userId,
                    walletId,  // NULL if not related to a wallet
                    action,
                    module
                }
            }
        );
    } catch (error) {
        console.error('Error inserting audit log:', error);
    }
};

module.exports = { insertAuditLog };
