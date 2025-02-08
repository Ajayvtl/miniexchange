import * as React from 'react';
const CryptocurrencyStats: React.FC = () => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Cryptocurrencies</h2>
            <p>Active: 15</p>
            <p>Inactive: 3</p>
        </div>
    );
};

export default CryptocurrencyStats;
