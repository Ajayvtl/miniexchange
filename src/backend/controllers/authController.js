const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission, RolePermission } = require('../models'); // Ensure models are correctly imported
const { insertAuditLog } = require('../utils/logger');
const geoip = require('geoip-lite');  // Detect location from IP
const axios = require('axios'); // Replace vpn-detection-service
const IPINFO_API_TOKEN = process.env.IPINFO_API_TOKEN;
// Helper function to detect VPN using ipinfo.io
const isVpnDetected = async (ip) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${IPINFO_API_TOKEN}`);
        if (response.data && response.data.privacy && response.data.privacy.proxy) {
            return true;  // VPN or proxy detected
        }
        return false;
    } catch (error) {
        console.error('Error detecting VPN:', error);
        return false;  // Assume no VPN if API fails
    }
};
// Login Controller
// Login Controller with VPN Detection
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: { model: Role, include: [Permission] }, // Include permissions dynamically
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Gather permissions from the role and associated permissions
        const userPermissions = user.Role.Permissions.map((permission) => permission.name);

        // Sign JWT with permissions
        const token = jwt.sign(
            {
                id: user.id,
                role: user.Role.name,
                permissions: userPermissions, // Attach permissions
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role.name,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Fetch permissions dynamically
        const user = await User.findOne({
            where: { id: decoded.id },
            include: [{ model: Role, include: [Permission] }]
        });

        req.user.permissions = user.Role.Permissions.map(p => p.name);
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};