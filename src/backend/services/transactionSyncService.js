const axios = require("axios");
const { Cryptocurrency } = require("../models");

/**
 * Fetch API Key & Provider from Database
 */
// const getApiConfig = async (networkName, clientId) => {
//     try {
//         const cryptoConfig = await Cryptocurrency.findOne({
//             where: { network_name: networkName, status: "active" },
//             attributes: ["api_key", "api_provider", "api_url", "client_ids"]
//         });

//         if (!cryptoConfig) return null;

//         // Ensure client is authorized
//         const authorizedClients = JSON.parse(cryptoConfig.client_ids || "[]");
//         if (!authorizedClients.includes(clientId)) {
//             console.log(`❌ Client ID ${clientId} is not authorized for ${networkName}`);
//             return null;
//         }

//         return cryptoConfig.toJSON();
//     } catch (error) {
//         console.error("❌ Error fetching API config:", error);
//         return null;
//     }
// };
const getApiConfig = async (networkName, symbol) => {
    try {
        console.log("🔹 Fetching API Config...");
        console.log(`🔹 Input Parameters -> Network: ${networkName}, Symbol: ${symbol}`);

        if (!symbol) {
            console.log("❌ Symbol is missing or undefined!");
            return null;
        }

        // Fetch API configuration from the database
        const cryptoConfig = await Cryptocurrency.findOne({
            where: { network_name: networkName, symbol: symbol, status: "active" },
            attributes: ["api_key", "api_provider", "api_url", "contract_address", "type"]
        });

        if (!cryptoConfig) {
            console.log(`❌ No API configuration found for network: ${networkName}, symbol: ${symbol}`);
            return null;
        }

        console.log("✅ Retrieved API Config from Database:", cryptoConfig.toJSON());

        return cryptoConfig.toJSON();
    } catch (error) {
        console.error("❌ Error fetching API config:", error);
        return null;
    }
};




/**
 * Fetch Transactions from API Provider
 */
const fetchTransactions = async (walletAddress, networkName, clientId, symbol) => {
    console.log(walletAddress);
    console.log(networkName);
    console.log(clientId);
    console.log(symbol);
    try {
        if (!walletAddress || !networkName || !clientId || !symbol) {
            console.log(`❌ Missing required parameters: walletAddress, networkName, clientId, symbol`);
            return [];
        }

        console.log(`🔹 Fetching transactions for Wallet: ${walletAddress}, Network: ${networkName}, Symbol: ${symbol}, Client ID: ${clientId}`);

        // Fetch API config from database
        const apiConfig = await getApiConfig(networkName, symbol);
        if (!apiConfig) {
            console.log(`❌ No API config found for network: ${networkName}, symbol: ${symbol}, client ID: ${clientId}`);
            return [];
        }

        console.log(`✅ Using API config:`, apiConfig);

        let apiUrl;
        if (apiConfig.type === "Coin") {
            // Fetch Native Coin Transactions
            apiUrl = `${apiConfig.api_url}?module=account&action=txlist&address=${walletAddress}&apikey=${apiConfig.api_key}`;
            console.log(`🔹 Fetching native coin transactions from: ${apiUrl}`);
        } else if (apiConfig.type === "Token") {
            // Fetch Token Transactions
            apiUrl = `${apiConfig.api_url}?module=account&action=tokentx&address=${walletAddress}&contractaddress=${apiConfig.contract_address}&apikey=${apiConfig.api_key}`;
            console.log(`🔹 Fetching token transactions from: ${apiUrl}`);
        } else {
            console.log(`❌ Unknown type for ${symbol}: ${apiConfig.type}`);
            return [];
        }

        const response = await axios.get(apiUrl);
        if (!response.data || response.data.status !== "1") {
            console.log(`❌ Failed to fetch transactions: ${response.data.message}`);
            return [];
        }

        return response.data.result;
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return [];
    }
};




/**
 * Synchronize Transactions with Database
 */
const syncTransactions = async (walletAddress, networkName, clientId) => {
    const transactions = await fetchTransactions(walletAddress, networkName, clientId);

    if (transactions.length === 0) {
        console.log(`⚠️ No transactions found for ${walletAddress} on ${networkName}`);
        return;
    }

    console.log(`✅ Retrieved ${transactions.length} transactions for ${walletAddress} on ${networkName}`);
    // TODO: Store transactions in the database or processing queue
};
const fetchAndStoreTransactions = async (walletAddress, networkName, clientId) => {
    const transactions = await fetchTransactions(walletAddress, networkName, clientId);

    if (transactions.length === 0) {
        console.log(`⚠️ No transactions found for ${walletAddress} on ${networkName}`);
        return;
    }

    console.log(`✅ Retrieved ${transactions.length} transactions for ${walletAddress} on ${networkName}`);
    // TODO: Store transactions in the database

    return transactions;
};

module.exports = { fetchTransactions, syncTransactions, fetchAndStoreTransactions };
