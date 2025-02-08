import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ListWallets = () => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await axios.get('/wallets/1'); // Replace with dynamic user ID
                setWallets(response.data);
            } catch (error) {
                console.error('Error fetching wallets:', error);
            }
        };
        fetchWallets();
    }, []);

    return (
        <div>
            <h2>User Wallets</h2>
            <ul>
                {wallets.map((wallet) => (
                    <li key={wallet.id}>
                        {wallet.walletAddress} (EVM Compatible: {wallet.isEvmCompatible ? 'Yes' : 'No'})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListWallets;
