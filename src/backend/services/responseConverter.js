const convertApiResponse = (apiResponse, apiProvider) => {
    switch (apiProvider) {
        case 'bscscan':
            return {
                hash: apiResponse.txHash,
                from: apiResponse.fromAddress,
                to: apiResponse.toAddress,
                value: apiResponse.value,
            };
        case 'etherscan':
            return {
                hash: apiResponse.hash,
                from: apiResponse.from,
                to: apiResponse.to,
                value: apiResponse.amount,
            };
        default:
            throw new Error('Unknown API provider');
    }
};

module.exports = { convertApiResponse };
