// src/backend/controllers/walletController.js
const sequelize = require('../config/database');
const { rsaEncrypt, rsaDecrypt } = require('../utils/rsaEncryption');
const { insertAuditLog } = require('../utils/logger');
const crypto = require('crypto');
const rsaPublicKey = process.env.RSA_PUBLIC_KEY.replace(/\n/g, '\n');
const rsaPrivateKey = process.env.RSA_PRIVATE_KEY
    ? process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n')
    : (() => {
        console.error('RSA_PRIVATE_KEY is not defined in environment variables');
        process.exit(1);
    })();

// Utility function to derive the public key from a mnemonic
function derivePublicKeyFromMnemonic(mnemonic) {
    const hash = crypto.createHash('sha256').update(mnemonic).digest('hex');
    return `04${hash.slice(0, 64)}`;  // Simulate deriving a public key (replace with actual derivation logic)
}
// Utility function to derive the public key from a private key or mnemonic
function derivePublicKeyFromPrivateKey(privateKey) {
    const hash = crypto.createHash('sha256').update(privateKey).digest('hex');
    return `04${hash.slice(0, 64)}`;  // Example derivation, replace with proper logic
}
function deriveUniqueIdentifier(mnemonic) {
    return crypto.createHash('sha256').update(mnemonic).digest('hex'); // Generate a unique user identifier
}
// Restore Wallet using mnemonic or encrypted private key
exports.restoreWallet = async (req, res) => {
    try {
        const { mnemonic, encryptedPrivateKey } = req.body;

        if (!mnemonic && !encryptedPrivateKey) {
            return res.status(400).json({ message: 'Either mnemonic or encrypted private key is required' });
        }

        let publicKey;
        if (mnemonic) {
            // Derive the public key from the mnemonic (simulating private key)
            const privateKey = crypto.createHash('sha256').update(mnemonic).digest('hex');
            publicKey = derivePublicKeyFromPrivateKey(privateKey);
        } else {
            // Decrypt the private key using RSA
            const decryptedPrivateKey = rsaDecrypt(encryptedPrivateKey, rsaPrivateKey);
            publicKey = derivePublicKeyFromPrivateKey(decryptedPrivateKey);
        }

        // Find wallets and keys associated with this public key using encrypted_keys
        const wallets = await sequelize.query(
            `
            SELECT 
                w.id AS wallet_id, 
                w.wallet_address, 
                w.is_evm_compatible, 
                w.backup, 
                ek.encrypted_private_key, 
                w.created_at, 
                w.updated_at
            FROM wallet_addresses w
            INNER JOIN encrypted_keys ek ON w.id = ek.wallet_id
            WHERE ek.encrypted_private_key IS NOT NULL AND ek.user_id = (SELECT user_id FROM encrypted_keys WHERE encrypted_private_key = :publicKey LIMIT 1)
            `,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { publicKey },
            }
        );

        if (!wallets.length) {
            return res.status(404).json({ message: 'No wallets found for this user' });
        }

        // Log the wallet restoration
        await insertAuditLog(null, null, 'Wallet Restored');

        res.status(200).json({ wallets });
    } catch (error) {
        console.error('Error restoring wallet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Other existing functions
exports.addWallet = async (req, res) => {
    if (!rsaPublicKey) {
        console.error('RSA Public Key is not defined in environment variables');
        return res.status(500).json({ message: 'RSA Public Key is not configured' });
    }

    try {
        const { userId, walletAddress, walletTypeId, isEvmCompatible, privateKey, backup } = req.body;

        if (!userId || !walletAddress || !walletTypeId || !privateKey) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Insert wallet into wallet_addresses table
        await sequelize.query(
            `
            INSERT INTO wallet_addresses (user_id, wallet_address, wallet_type_id, is_evm_compatible, backup, created_at, updated_at)
            VALUES (:userId, :walletAddress, :walletTypeId, :isEvmCompatible, :backup, NOW(), NOW())
            `,
            {
                replacements: { userId, walletAddress, walletTypeId, isEvmCompatible, backup },
            }
        );

        // Encrypt the private key
        const encryptedPrivateKey = rsaEncrypt(privateKey, rsaPublicKey);

        // Get the wallet_id for the newly added wallet
        const [wallet] = await sequelize.query(
            `SELECT id FROM wallet_addresses WHERE wallet_address = :walletAddress`,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { walletAddress },
            }
        );

        if (!wallet) {
            return res.status(400).json({ message: 'Failed to retrieve wallet ID after insertion' });
        }

        // Insert encrypted private key into encrypted_keys table
        await sequelize.query(
            `
            INSERT INTO encrypted_keys (user_id, wallet_id, encrypted_private_key, created_at, updated_at)
            VALUES (:userId, :walletId, :encryptedPrivateKey, NOW(), NOW())
            `,
            {
                replacements: { userId, walletId: wallet.id, encryptedPrivateKey },
            }
        );

        // Log the action
        await insertAuditLog(userId, wallet.id, 'Add Wallet');

        res.status(201).json({ message: 'Wallet with encrypted private key added successfully' });
    } catch (error) {
        console.error('Error adding wallet with private key:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getWalletsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const includeKey = req.query.includeKey === 'true';

        // Fetch wallets and associated encrypted private keys
        const wallets = await sequelize.query(
            `
            SELECT 
                w.id AS wallet_id, 
                w.wallet_address, 
                w.is_evm_compatible, 
                w.backup, 
                w.created_at, 
                w.updated_at
                ${includeKey ? ', ek.encrypted_private_key' : ''}
            FROM wallet_addresses w
            LEFT JOIN encrypted_keys ek ON w.id = ek.wallet_id
            WHERE w.user_id = :userId
            `,
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { userId },
            }
        );

        if (!wallets.length) {
            return res.status(404).json({ message: 'No wallets found for this user' });
        }

        if (includeKey) {
            for (const wallet of wallets) {
                await insertAuditLog(userId, wallet.wallet_id, 'View Encrypted Private Key');
            }
        }

        res.status(200).json(wallets);
    } catch (error) {
        console.error('Error fetching wallets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateWalletStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled, blocked } = req.body;

        if (enabled === undefined || blocked === undefined) {
            return res.status(400).json({ message: 'Both "enabled" and "blocked" fields are required' });
        }

        const result = await sequelize.query(
            `
            UPDATE wallet_addresses
            SET enabled = :enabled, blocked = :blocked, updated_at = NOW()
            WHERE id = :id
            `,
            { replacements: { id, enabled, blocked } }
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Wallet not found or no changes made' });
        }

        // Log the action
        await insertAuditLog(req.user.id, id, 'Update Wallet Status');

        res.status(200).json({ message: 'Wallet status updated successfully' });
    } catch (error) {
        console.error('Error updating wallet status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteWallet = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        console.log('Request User:', req.user); // Debug log
        // Delete the wallet
        await sequelize.query(
            `
            DELETE FROM wallet_addresses
            WHERE id = :id
            `,
            { replacements: { id } }
        );

        // Log the action
        await insertAuditLog(req.user.id, id, 'Delete Wallet');

        res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// exports.backupWallet = async (req, res) => {
//     try {
//         const { userId, walletId, encryptedPrivateKey, backupData } = req.body;

//         if (!userId || !walletId || !encryptedPrivateKey || !backupData) {
//             return res.status(400).json({ message: 'Required fields are missing' });
//         }

//         // Encrypt backup data (if needed)
//         const encryptedBackupData = rsaEncrypt(backupData, rsaPublicKey);

//         // Store the encrypted private key and backup in the database
//         await sequelize.query(
//             `
//             UPDATE encrypted_keys 
//             SET encrypted_private_key = :encryptedPrivateKey, updated_at = NOW() 
//             WHERE user_id = :userId AND wallet_id = :walletId
//             `,
//             {
//                 replacements: { userId, walletId, encryptedPrivateKey },
//             }
//         );

//         await sequelize.query(
//             `
//             UPDATE wallet_addresses 
//             SET backup = :encryptedBackupData, updated_at = NOW() 
//             WHERE id = :walletId
//             `,
//             {
//                 replacements: { encryptedBackupData, walletId },
//             }
//         );

//         // Log the backup action
//         await insertAuditLog(userId, walletId, 'Wallet Backup Created');

//         res.status(200).json({ message: 'Wallet backup successfully stored' });
//     } catch (error) {
//         console.error('Error backing up wallet:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
// Backup Wallets and Store Encrypted Information
exports.backupWallet = async (req, res) => {
    try {
        const { mnemonic, wallets, backupData } = req.body;

        if (!mnemonic || !wallets) {
            return res.status(400).json({ message: 'Mnemonic and wallet data are required' });
        }

        let userIdentifier = deriveUniqueIdentifier(mnemonic);
        let finalUserId;

        // Check if user exists
        const [existingUser] = await sequelize.query(
            `SELECT id FROM users WHERE username = :userIdentifier LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT, replacements: { userIdentifier } }
        );

        if (!existingUser) {
            // Fetch default role_id (assuming role 'User' exists)
            const [defaultRole] = await sequelize.query(
                `SELECT id FROM roles WHERE name = 'User' LIMIT 1`,
                { type: sequelize.QueryTypes.SELECT }
            );
            const roleId = defaultRole ? defaultRole.id : 1; // Fallback to role_id = 1 if 'User' role is missing

            // Create a new user entry
            const [newUser] = await sequelize.query(
                `INSERT INTO users (username, role_id, createdAt, updatedAt) VALUES (:userIdentifier, :roleId, NOW(), NOW())`,
                { replacements: { userIdentifier, roleId } }
            );
            finalUserId = newUser.insertId;
        } else {
            finalUserId = existingUser.id;
        }

        // Encrypt backup data (mnemonic & passkey)
        const encryptedBackupData = rsaEncrypt(JSON.stringify(backupData), rsaPublicKey);

        // Store encrypted mnemonic & passkey in encrypted_data table
        await sequelize.query(
            `INSERT INTO encrypted_data (user_id, encrypted_passkey, created_at, updated_at)
             VALUES (:userId, :encryptedBackupData, NOW(), NOW())
             ON DUPLICATE KEY UPDATE encrypted_passkey = :encryptedBackupData, updated_at = NOW()`,
            {
                replacements: { userId: finalUserId, encryptedBackupData },
            }
        );

        for (const wallet of wallets) {
            if (!wallet.walletAddress || !wallet.encryptedPrivateKey) {
                return res.status(400).json({ message: 'Each wallet must have a walletAddress and encryptedPrivateKey' });
            }

            // Insert or update wallet in wallet_addresses
            const [existingWallet] = await sequelize.query(
                `SELECT id FROM wallet_addresses WHERE wallet_address = :walletAddress AND user_id = :userId LIMIT 1`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: { walletAddress: wallet.walletAddress, userId: finalUserId },
                }
            );

            let walletId = existingWallet ? existingWallet.id : null;

            if (!walletId) {
                const [newWallet] = await sequelize.query(
                    `INSERT INTO wallet_addresses (user_id, wallet_address, wallet_type, is_evm_compatible, backup, created_at, updated_at)
                     VALUES (:userId, :walletAddress, :walletType, :isEvmCompatible, :encryptedBackupData, NOW(), NOW())`,
                    {
                        replacements: {
                            userId: finalUserId,
                            walletAddress: wallet.walletAddress,
                            walletType: wallet.walletType || 'Unknown',
                            isEvmCompatible: wallet.isEvmCompatible || false,
                            encryptedBackupData,
                        },
                    }
                );
                walletId = newWallet.insertId;
            }

            // Insert or update encrypted private key
            await sequelize.query(
                `INSERT INTO encrypted_keys (user_id, wallet_id, encrypted_private_key, created_at, updated_at)
                 VALUES (:userId, :walletId, :encryptedPrivateKey, NOW(), NOW())
                 ON DUPLICATE KEY UPDATE encrypted_private_key = :encryptedPrivateKey, updated_at = NOW()`,
                {
                    replacements: { userId: finalUserId, walletId, encryptedPrivateKey: wallet.encryptedPrivateKey },
                }
            );

            // Log the backup action
            await insertAuditLog(finalUserId, walletId, 'Wallet Backup Created');
        }

        res.status(200).json({ message: 'Wallet backup successfully stored or updated' });
    } catch (error) {
        console.error('Error backing up wallet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

