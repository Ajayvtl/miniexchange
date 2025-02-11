const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role, Permission, RolePermission } = require('../models'); // Ensure models are correctly imported
const { insertAuditLog } = require('../utils/logger');
const geoip = require('geoip-lite');  // Detect location from IP
const axios = require('axios'); // Replace vpn-detection-service
const IPINFO_API_TOKEN = process.env.IPINFO_API_TOKEN;
const crypto = require('crypto');
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

// Utility function to derive the public key from a mnemonic
function derivePublicKeyFromMnemonic(mnemonic) {
    // Simulate derivation logic (use a proper library in production)
    const hash = crypto.createHash('sha256').update(mnemonic).digest('hex');
    return `04${hash.slice(0, 64)}`;
}

// POST /auth/wallet
exports.authenticateWallet = async (req, res) => {
    try {
        const { mnemonic, device_id } = req.body;

        if (!mnemonic || !device_id) {
            return res.status(400).json({ success: false, message: 'Mnemonic and device ID are required' });
        }

        // Derive the public key from the mnemonic
        const publicKey = derivePublicKeyFromMnemonic(mnemonic);

        // Check if a user with this public key exists
        let user = await User.findOne({ where: { public_key: publicKey } });
        if (!user) {
            // Create a new user if not found
            user = await User.create({
                public_key: publicKey,
                device_id,
                is_enabled: 1,
                kyc_status: 'pending'  // Default to pending KYC verification
            });
            await insertAuditLog(user.id, null, 'Wallet Created');
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, publicKey }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        // Issue a refresh token
        const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            access_token: token,
            refresh_token: refreshToken
        });
    } catch (error) {
        console.error('Error during wallet authentication:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// Middleware to validate token
exports.validateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied, token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Attach user details to the request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};