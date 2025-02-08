const crypto = require('crypto');

// Encrypt data using RSA public key
const rsaEncrypt = (data, publicKey) => {
    console.log('Public Key:', publicKey);
    try {
        console.log('Encrypting with RSA Public Key'); // Debug log
        if (!publicKey) {
            throw new Error('RSA Public Key is not defined');
        }
        if (!publicKey.startsWith('-----BEGIN PUBLIC KEY-----')) {
            throw new Error('Invalid RSA Public Key format');
        }
        return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
    } catch (error) {
        console.error('RSA Encryption Error:', error);
        throw error;
    }
};

// Decrypt data using RSA private key
const rsaDecrypt = (encryptedData, privateKey) => {
    try {
        return crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(encryptedData, 'base64')
        ).toString('utf8');
    } catch (error) {
        console.error('RSA Decryption Error:', error);
        throw error;
    }
};
module.exports = { rsaEncrypt, rsaDecrypt };
