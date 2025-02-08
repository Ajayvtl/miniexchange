const crypto = require('crypto');
const fs = require('fs');

const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    fs.writeFileSync('rsa_public.pem', publicKey);
    fs.writeFileSync('rsa_private.pem', privateKey);

    console.log('RSA Key Pair Generated');
};

generateKeyPair();
