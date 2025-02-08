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

module.exports = { checkPermission };
