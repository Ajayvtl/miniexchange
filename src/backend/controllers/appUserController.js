const bip39 = require("bip39");
const { User, AppUser, WalletType, WalletAddress, Transaction, Cryptocurrency } = require("../models");
const jwt = require("jsonwebtoken");
const { Wallet } = require("ethers");
const { Op } = require("sequelize");
// const crypto = require("crypto");
const blacklistedTokens = require("../utils/tokenBlacklist"); // ✅ Import blacklist
let activeRefreshTokens = {};
const { decryptBase64, encryptBase64 } = require("../utils/cryptoUtils");
const secretKey = process.env.SECRET_KEY || "default_secret";
// let blacklistedTokens = new Set(); // ✅ Store invalidated tokens (can be replaced with DB storage)
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
        const secretKey = process.env.SECRET_KEY || "default_secret"; // Use a strong secret from .env
        const encrypted_passkey = encryptMnemonic(mnemonic, secretKey);
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
        const token = generateAppJWT(user.id, appUser.id, walletAddr.id);

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
exports.getCryptoList = async (req, res) => {
    try {
        console.log("🔹 Fetching Cryptocurrency List...");

        // ✅ Fetch all active coins & tokens from the database
        const cryptoList = await Cryptocurrency.findAll({
            where: { status: "active" }, // ✅ Only fetch active cryptos
            attributes: [
                "id",
                "name",
                "symbol",
                "contract_address",
                "chain_id",
                "network_name",
                "explorer_url",
                "type",
                "decimals"
            ]
        });

        if (!cryptoList || cryptoList.length === 0) {
            console.log("❌ No active cryptocurrencies found.");
            return res.status(404).json({ error: "No cryptocurrencies available." });
        }

        console.log(`✅ Retrieved ${cryptoList.length} cryptocurrencies.`);

        // ✅ Return formatted response
        res.status(200).json({
            message: "Cryptocurrency list fetched successfully.",
            cryptos: cryptoList
        });
    } catch (error) {
        console.error("❌ Error fetching cryptocurrencies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// exports.listUserWallets = async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const wallets = await WalletAddress.findAll({
//             where: { user_id: userId },
//             attributes: ["id", "wallet_address", "wallet_type_id", "enabled", "blocked", "created_at"]
//         });

//         res.status(200).json({ wallets });
//     } catch (error) {
//         console.error("Error fetching wallets:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

exports.listUserWallets = async (req, res) => {
    try {
        console.log("🔹 listUserWallets function triggered.");

        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.appUser.userId;

        if (!requestedUserId) {
            return res.status(400).json({ error: "Missing userId in URL parameters." });
        }

        if (requestedUserId != authenticatedUserId) {
            return res.status(403).json({ error: "Unauthorized access to wallets." });
        }

        const appUser = await AppUser.findOne({ where: { user_id: authenticatedUserId } });

        if (!appUser) {
            return res.status(404).json({ error: "AppUser not found." });
        }

        console.log("✅ Found AppUser ID:", appUser.id);

        const wallets = await WalletAddress.findAll({
            where: { user_id: appUser.id },
            attributes: ["id", "wallet_address", "wallet_type_id", "enabled", "blocked", "created_at", "encrypted_passkey"]
        });

        if (!wallets || wallets.length === 0) {
            return res.status(404).json({ error: "No wallets found for this user." });
        }

        console.log(`✅ Retrieved ${wallets.length} wallets for AppUser ID ${appUser.id}`);

        // ✅ Decrypt private key for each wallet and re-encrypt before returning
        const formattedWallets = wallets.map(wallet => {
            const decryptedPrivateKey = decryptMnemonic(wallet.encrypted_passkey, secretKey);// ✅ Decrypt the private key
            return {
                id: wallet.id,
                wallet_address: wallet.wallet_address,
                wallet_type_id: wallet.wallet_type_id,
                enabled: wallet.enabled,
                blocked: wallet.blocked,
                created_at: wallet.created_at,
                private_key: decryptedPrivateKey, // ✅ Send in Base64 format
            };
        });

        res.status(200).json({ wallets: formattedWallets });
    } catch (error) {
        console.error("❌ Error fetching wallets:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


function encryptPrivateKeyToBase64(privateKey) {
    return Buffer.from(privateKey, "utf8").toString("base64");
}




exports.refreshToken = async (req, res) => {
    try {
        console.log("🔹 Refresh Token function triggered.");

        // ✅ Extract token from Authorization Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        const token = authHeader.split(" ")[1];

        // ✅ Extract mnemonic from request body
        const { mnemonic } = req.body;
        if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
            return res.status(400).json({ error: "Invalid mnemonic phrase." });
        }

        // ✅ Verify the existing token
        jwt.verify(token, process.env.JWT_SECRET_APP, async (err, decodedUser) => {
            if (err) {
                console.log("❌ Invalid or expired token:", err.message);
                return res.status(403).json({ error: "Invalid or expired token. Please restore your wallet." });
            }

            console.log("✅ Decoded Token:", decodedUser);

            // ✅ Check if the user exists
            const user = await User.findOne({ where: { id: decodedUser.userId } });

            if (!user) {
                return res.status(404).json({ error: "User not found. Please restore your wallet." });
            }

            console.log("✅ User Found:", user.id);

            // ✅ Generate a new JWT token
            const newToken = generateAppJWT(user.id);

            console.log("✅ New Token Generated");
            res.status(200).json({
                token: newToken,
                message: "Token refreshed successfully."
            });
        });
    } catch (error) {
        console.error("❌ Error refreshing token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




exports.updateWallet = async (req, res) => {
    try {
        const { walletId } = req.params;
        const { enabled, blocked } = req.body;

        // ✅ Get authenticated user ID
        const authenticatedUserId = req.appUser.userId;

        // ✅ Ensure wallet belongs to the authenticated user
        const wallet = await WalletAddress.findOne({ where: { id: walletId, user_id: authenticatedUserId } });

        if (!wallet) {
            return res.status(404).json({ error: "Wallet not found or you do not have permission to update it." });
        }

        await wallet.update({ enabled, blocked });

        res.status(200).json({ message: "Wallet updated successfully", wallet });
    } catch (error) {
        console.error("Error updating wallet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.restoreWallet = async (req, res) => {
    try {
        console.log("🔹 Restoring wallet...");

        const { mnemonic } = req.body;
        if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
            return res.status(400).json({ error: "Invalid mnemonic phrase." });
        }

        // ✅ Derive wallet address from the mnemonic
        const wallet_address = deriveWalletAddress(mnemonic);
        console.log("✅ Derived Wallet Address:", wallet_address);

        // ✅ Check if user exists
        const user = await User.findOne({ where: { username: wallet_address } });

        if (!user || !user.id) {
            console.log(`❌ No user found with wallet address: ${wallet_address}`);
            return res.status(404).json({ error: "User not found." });
        }
        console.log("✅ User Found:", user.id);

        // ✅ Get `app_user_id` from `AppUser`
        const appUser = await AppUser.findOne({ where: { user_id: user.id } });

        if (!appUser || !appUser.id) {
            console.log(`❌ No AppUser found for user_id: ${user.id}`);
            return res.status(404).json({ error: "AppUser not found." });
        }
        console.log("✅ AppUser Found:", appUser.id);

        // ✅ Fetch all wallets associated with `app_user_id`
        const wallets = await WalletAddress.findAll({
            where: { user_id: appUser.id },
            attributes: ["id", "wallet_address", "wallet_type_id", "enabled", "blocked", "created_at", "encrypted_passkey"]
        });

        if (!wallets || wallets.length === 0) {
            console.log(`❌ No wallets found for app_user_id: ${appUser.id}`);
            return res.status(404).json({ error: "No wallets found for this user." });
        }
        console.log(`✅ Found ${wallets.length} wallets for AppUser ID ${appUser.id}`);

        // ✅ Decrypt each wallet's private key
        const secretKey = process.env.SECRET_KEY || "default_secret";

        const decryptedWallets = wallets.map(wallet => {
            const decryptedPrivateKey = decryptMnemonic(wallet.encrypted_passkey, secretKey); // Decrypt each key individually
            console.log(`🔹 Wallet: ${wallet.wallet_address} -> Decrypted Private Key: ${decryptedPrivateKey}`);
            return {
                id: wallet.id,
                wallet_address: wallet.wallet_address,
                wallet_type_id: wallet.wallet_type_id,
                enabled: wallet.enabled,
                blocked: wallet.blocked,
                created_at: wallet.created_at,
                private_key: decryptedPrivateKey // Return correctly encoded Base64 private key
            };
        });

        // ✅ Fetch transaction history for the user
        const transactions = await Transaction.findAll({
            where: { userId: user.id },
            attributes: ["id", "amount", "cryptocurrency", "status", "details", "created_at"]
        });

        console.log(`✅ Retrieved ${transactions.length} transactions for User ID ${user.id}`);

        // ✅ Generate a new token upon successful wallet restoration
        const newToken = generateAppJWT(user.id);
        console.log("✅ New Token Generated for Restored User:", newToken);

        // ✅ Return full restoration data including the new authentication token
        res.status(200).json({
            user: {
                id: user.id,
                app_user_id: appUser.id,
                token: newToken
            },
            wallets: decryptedWallets,
            transactions,
            message: "Wallet restored successfully."
        });
    } catch (error) {
        console.error("❌ Error restoring wallet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





exports.logoutUser = async (req, res) => {
    try {
        console.log("🔹 Logout function triggered.");

        // ✅ Extract Authorization Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        const token = authHeader.split(" ")[1];

        // ✅ Verify Token
        jwt.verify(token, process.env.JWT_SECRET_APP, (err, decodedUser) => {
            if (err) {
                console.log("❌ Invalid or expired token during logout:", err.message);
                return res.status(403).json({ error: "Invalid or expired token. Please restore your wallet." });
            }

            console.log(`✅ User ${decodedUser.userId} is logging out.`);

            // ✅ Blacklist the token (so it can't be reused)
            blacklistedTokens.add(token);
            console.log(`✅ Token ${token} has been blacklisted.`);

            res.status(200).json({ message: "User logged out successfully. Please restore your wallet to log in again." });
        });
    } catch (error) {
        console.error("❌ Error logging out user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.registerWallet = async (req, res) => {
    try {
        console.log("🔹 Registering a new wallet...");

        const { userId, walletAddress, walletTypeId, privateKey } = req.body;

        if (!userId || !walletTypeId || !privateKey || !walletAddress) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // ✅ Encrypt the private key
        // const encryptedPrivateKey = encryptBase64(privateKey);
        const encryptedPrivateKey = encryptMnemonic(privateKey, secretKey);
        console.log(privateKey);
        const test = decryptMnemonic(encryptedPrivateKey, secretKey);
        console.log(test);
        // ✅ Store the wallet in the database
        const newWallet = await WalletAddress.create({
            wallet_address: walletAddress, // ✅ Derive Address
            user_id: userId,
            wallet_type_id: walletTypeId,
            encrypted_passkey: encryptedPrivateKey, // ✅ Store Encrypted Private Key
            enabled: true,
            blocked: false
        });
        // ✅ Fetch stored encrypted private key from the database
        const storedWallet = await WalletAddress.findOne({
            where: { id: newWallet.id },
            attributes: ["encrypted_passkey"]
        });

        // ✅ Decode Base64 private key for verification
        const decryptedPrivateKeyDB = decryptMnemonic(storedWallet.encrypted_passkey, secretKey);
        // const decryptedPrivateKeyDB = decryptPrivateKey(storedWallet.encrypted_passkey, secretKey);
        res.status(201).json({
            message: "Wallet registered successfully.",
            walletAddress: newWallet.wallet_address,
            encryptedPrivateKey: encryptedPrivateKey, // ✅ Encrypted Private Key
            fromdb: decryptedPrivateKeyDB
        });
        // res.status(201).json({
        //     message: "Wallet registered successfully.",
        //     walletAddress: newWallet.wallet_address
        // });
    } catch (error) {
        console.error("❌ Error registering wallet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const crypto = require("crypto");

// ✅ Function to Encrypt Private Key
function encryptPrivateKey(privateKey, passphrase) {
    const key = crypto.createHash("sha256").update(passphrase).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

// ✅ Function to Decrypt Private Key
function decryptPrivateKey(encryptedPrivateKey, passphrase) {
    const key = crypto.createHash("sha256").update(passphrase).digest();
    const [iv, encrypted] = encryptedPrivateKey.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}


function deriveWalletAddress(mnemonic) {
    const bip39 = require("bip39");
    const crypto = require("crypto");

    // 🔹 Convert mnemonic to a SHA256 hash (or use proper derivation for blockchain wallets)
    return `0x${crypto.createHash("sha256").update(mnemonic).digest("hex").slice(0, 40)}`;
}
// ✅ Encrypt the mnemonic using base64 (replace with AES encryption if needed)
function encryptMnemonic(mnemonic, secretKey) {
    if (!mnemonic || !secretKey) {
        throw new Error("Missing mnemonic or secretKey for encryption.");
    }

    const key = crypto.createHash("sha256").update(secretKey).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(mnemonic, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
}

function decryptMnemonic(encryptedMnemonic, secretKey) {
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const [iv, encrypted] = encryptedMnemonic.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
// JWT Token Generation
function generateAppJWT(userId) {
    if (!process.env.JWT_SECRET_APP) {
        console.error("❌ JWT_SECRET_APP is undefined. Check your .env file.");
        throw new Error("Server Configuration Error: JWT_SECRET_APP is missing.");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET_APP, { expiresIn: '30d' });
}
