const rateLimitMap = new Map(); // To track API rate limits

const checkRateLimit = (apiKey, limitPerSecond, limitPerMinute) => {
    const currentTime = Date.now();

    if (!rateLimitMap.has(apiKey)) {
        rateLimitMap.set(apiKey, { calls: [], minuteCalls: [] });
    }

    const { calls, minuteCalls } = rateLimitMap.get(apiKey);

    // Filter calls within the last second and minute
    const filteredCalls = calls.filter((timestamp) => currentTime - timestamp < 1000);
    const filteredMinuteCalls = minuteCalls.filter((timestamp) => currentTime - timestamp < 60000);

    if (filteredCalls.length >= limitPerSecond || filteredMinuteCalls.length >= limitPerMinute) {
        return false; // Rate limit exceeded
    }

    // Log the current call
    filteredCalls.push(currentTime);
    filteredMinuteCalls.push(currentTime);

    rateLimitMap.set(apiKey, { calls: filteredCalls, minuteCalls: filteredMinuteCalls });
    return true;
};

module.exports = { checkRateLimit };
