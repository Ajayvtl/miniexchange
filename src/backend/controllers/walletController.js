const sequelize = require('../config/database');
const { rsaEncrypt } = require('../utils/rsaEncryption');
const { insertAuditLog } = require('../utils/logger');
const rsaPublicKey = process.env.RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

// Add Wallet
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

// Get Wallets by User
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

// Update Wallet Status
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

// Delete Wallet
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
