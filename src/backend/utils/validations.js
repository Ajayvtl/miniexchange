// Validate Ethereum-style wallet addresses
const isValidEvmAddress = (address) => {
    const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/; // Regex for 42-char Ethereum-style address
    return evmAddressRegex.test(address);
};

module.exports = { isValidEvmAddress };
