const crypto = require('crypto');

// Environment variables
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex'); // Secure key (32 bytes)
const ivLength = 16; // AES requires a 16-byte IV

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Decrypt function
const decrypt = (encryptedText) => {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(Buffer.from(encryptedHex, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
};

module.exports = { encrypt, decrypt };
