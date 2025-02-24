const crypto = require("crypto");

/**
 * Encrypts a given text using Base64 encoding.
 * @param {string} text - The text to encrypt.
 * @returns {string} - Base64 encrypted string.
 */
const encryptBase64 = (text) => {
    return Buffer.from(text, "utf8").toString("base64");
};

/**
 * Decrypts a Base64 encoded string.
 * @param {string} encryptedText - The Base64 encoded string.
 * @returns {string} - Decrypted text.
 */
const decryptBase64 = (encryptedText) => {
    return Buffer.from(encryptedText, "base64").toString("utf8");
};

/**
 * Encrypts text using AES-256-CBC.
 * @param {string} text - Text to encrypt.
 * @param {string} secretKey - Secret key for encryption.
 * @returns {string} - Encrypted text in Base64.
 */
const encryptAES = (text, secretKey) => {
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};

/**
 * Decrypts an AES-256-CBC encrypted text.
 * @param {string} encryptedText - Encrypted text in Base64.
 * @param {string} secretKey - Secret key for decryption.
 * @returns {string} - Decrypted text.
 */
const decryptAES = (encryptedText, secretKey) => {
    const key = crypto.createHash("sha256").update(secretKey).digest();
    const [iv, encrypted] = encryptedText.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

module.exports = {
    encryptBase64,
    decryptBase64,
    encryptAES,
    decryptAES
};
