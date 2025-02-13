const bip39 = require("bip39");
const { User, AppUser, Wallet } = require("../models");
const jwt = require("jsonwebtoken");

console.log("Checking User model:", User); // ✅ Debugging
console.log("Checking AppUser model:", AppUser); // ✅ Debugging

exports.registerAppUser = async (req, res) => {
    try {
        const { mnemonic } = req.body;

        // 🔹 Validate Mnemonic
        if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
            return res.status(400).json({ error: "Invalid mnemonic phrase" });
        }

        // 🔹 Generate Wallet Address
        const walletAddress = deriveWalletAddress(mnemonic);

        // 🔹 Check if Wallet Already Exists
        let existingWallet = await AppUser.findOne({ where: { wallet_address: walletAddress } });

        if (existingWallet) {
            return res.status(409).json({ error: "User with this wallet already exists" });
        }

        // 🔹 Create a New User (AppUser Role)
        if (!User || !User.create) {
            return res.status(500).json({ error: "User model is not properly defined" });
        }

        const user = await User.create({
            username: walletAddress,
            email: null,
            password: null,
            role_id: 3 // App User Role
        });

        if (!AppUser || !AppUser.create) {
            return res.status(500).json({ error: "AppUser model is not properly defined" });
        }

        // 🔹 Create App User Entry
        const appUser = await AppUser.create({
            user_id: user.id,
            wallet_address: walletAddress,
            encrypted_passkey: encryptMnemonic(mnemonic)
        });

        // 🔹 Create Wallet for the User
        const wallet = await Wallet.create({
            user_id: user.id,
            wallet_address: walletAddress
        });

        // 🔹 Generate JWT Token
        const token = generateJWT(user.id, appUser.id, wallet.id);

        res.json({
            token,
            user: {
                id: user.id,
                app_user_id: appUser.id,
                wallet_id: wallet.id
            }
        });
    } catch (error) {
        console.error("Error in registerAppUser:", error);
        res.status(500).json({ error: error.message });
    }
};
function deriveWalletAddress(mnemonic) {
    const bip39 = require("bip39");
    const crypto = require("crypto");

    // 🔹 Convert mnemonic to a SHA256 hash (or use proper derivation for blockchain wallets)
    return `0x${crypto.createHash("sha256").update(mnemonic).digest("hex").slice(0, 40)}`;
}
