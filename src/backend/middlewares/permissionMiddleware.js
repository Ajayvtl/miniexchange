const jwt = require('jsonwebtoken');
const { User, Role, Permission, RolePermission } = require('../models');

// Middleware to check if the user has the required permission
async function checkPermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Unauthorized' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, { include: Role });

            if (!user) return res.status(401).json({ message: 'User not found' });

            const rolePermissions = await RolePermission.findAll({
                where: { role_id: user.role_id },
                include: Permission,
            });

            const hasPermission = rolePermissions.some((rp) => rp.Permission.name === requiredPermission);

            if (!hasPermission) return res.status(403).json({ message: 'Forbidden: Access Denied' });

            req.user = user; // Attach user to the request object
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}
exports.checkOwnData = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { walletId, transactionId } = req.params;

        if (walletId) {
            const wallet = await Wallet.findOne({ where: { id: walletId, user_id: userId } });
            if (!wallet) return res.status(403).json({ error: "Unauthorized access to wallet" });
        }

        if (transactionId) {
            const transaction = await Transaction.findOne({ where: { id: transactionId, userId } });
            if (!transaction) return res.status(403).json({ error: "Unauthorized access to transaction" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = { checkPermission };
