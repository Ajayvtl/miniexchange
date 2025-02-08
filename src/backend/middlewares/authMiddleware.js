const jwt = require('jsonwebtoken');
const { getPermissionsForRole } = require('../controllers/permissionController'); // Ensure this import is correct
// Verify JWT Token Middleware
// Verify JWT Token Middleware
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to the request object
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Role-Based Access Control Middleware
// exports.checkPermission = (requiredPermission) => {
//     return (req, res, next) => {
//         // Simulate role and permissions from token or DB (should ideally be fetched dynamically)
//         const userPermissions = req.user.permissions || [];

//         if (!userPermissions.includes(requiredPermission)) {
//             return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
//         }
//         next();
//     };
// };
exports.checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Fetch user's role and associated permissions
            const permissions = await getPermissionsForRole(req.user.role);

            if (!permissions.includes(requiredPermission)) {
                return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
            }
            next();
        } catch (error) {
            console.error('Error checking permission:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};