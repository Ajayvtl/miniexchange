const bip39 = require("bip39");
const { User, AppUser, WalletType, WalletAddress } = require("../models");
const jwt = require("jsonwebtoken");

console.log("Checking User model:", User); // ✅ Debugging
console.log("Checking AppUser model:", AppUser); // ✅ Debugging

console.log("Checking User model:", User); // ✅ Debugging
console.log("Checking AppUser model:", AppUser); // ✅ Debugging
console.log("Checking Wallet model:", WalletAddress); // ✅ Debugging

exports.registerAppUser = async (req, res) => {
    try {
        const { mnemonic, walletTypeId } = req.body;

        // ✅ Validate Mnemonic
        if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
            return res.status(400).json({ error: "Invalid mnemonic phrase" });
        }

        // ✅ Generate Wallet Address
        const wallet_address = deriveWalletAddress(mnemonic);

        // ✅ Check if Wallet Already Exists
        const existingWallet = await WalletAddress.findOne({ where: { wallet_address } });
        if (existingWallet) {
            return res.status(409).json({ error: "User with this wallet already exists" });
        }

        // ✅ Check if User Already Exists
        const existingUser = await User.findOne({ where: { username: wallet_address } });
        if (existingUser) {
            return res.status(409).json({ error: "User with this wallet address already exists in Users table" });
        }

        // ✅ Create a New User (AppUser Role)
        const user = await User.create({
            username: wallet_address,
            email: null,
            password: null,
            role_id: 3 // App User Role
        });

        if (!user || !user.id) {
            return res.status(500).json({ error: "Failed to create user." });
        }

        // ✅ Create App User Entry
        const encrypted_passkey = encryptMnemonic(mnemonic);
        const appUser = await AppUser.create({
            user_id: user.id,
            wallet_address: wallet_address,
            encrypted_passkey: encrypted_passkey
        });

        if (!appUser || !appUser.id) {
            return res.status(500).json({ error: "Failed to create AppUser." });
        }

        // ✅ Use Provided Wallet Type or Default to 6 (App Type)
        const selectedWalletTypeId = walletTypeId || 6;

        // ✅ Ensure Wallet Type Exists
        const walletType = await WalletType.findByPk(selectedWalletTypeId);
        if (!walletType) {
            return res.status(400).json({ error: `WalletType with id ${selectedWalletTypeId} does not exist.` });
        }

        // ✅ Fix: Ensure correct column names are used
        const walletAddr = await WalletAddress.create({
            user_id: user.id,  // ✅ Correct foreign key column
            wallet_type_id: selectedWalletTypeId,  // ✅ Correct column name
            wallet_address: wallet_address,  // ✅ Match DB schema
            encrypted_passkey: encrypted_passkey,  // ✅ Ensure encryptedPasskey is provided
            enabled: true,
            blocked: false
        });

        if (!walletAddr || !walletAddr.id) {
            return res.status(500).json({ error: "Failed to create WalletAddress." });
        }

        // ✅ Generate JWT Token
        const token = generateJWT(user.id, appUser.id, walletAddr.id);

        res.json({
            token,
            user: {
                id: user.id,
                app_user_id: appUser.id,
                wallet_address_id: walletAddr.id
            }
        });
    } catch (error) {
        console.error("Error in registerAppUser:", error);

        // ✅ Enhanced Error Handling
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(500).json({ error: "Invalid Wallet Type ID. Make sure it exists in wallet_types." });
        }
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(", ") });
        }

        res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
};






function deriveWalletAddress(mnemonic) {
    const bip39 = require("bip39");
    const crypto = require("crypto");

    // 🔹 Convert mnemonic to a SHA256 hash (or use proper derivation for blockchain wallets)
    return `0x${crypto.createHash("sha256").update(mnemonic).digest("hex").slice(0, 40)}`;
}
// ✅ Encrypt the mnemonic using base64 (replace with AES encryption if needed)
function encryptMnemonic(mnemonic) {
    return Buffer.from(mnemonic).toString("base64"); // Use AES or stronger encryption for production
}
// JWT Token Generation
function generateJWT(userId, roleId) {
    return jwt.sign({ userId, roleId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}