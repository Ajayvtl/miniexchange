import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ListCryptocurrencies = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);

    useEffect(() => {
        const fetchCryptocurrencies = async () => {
            try {
                const response = await axios.get('/cryptocurrencies');
                setCryptocurrencies(response.data);
            } catch (error) {
                console.error('Error fetching cryptocurrencies:', error);
            }
        };
        fetchCryptocurrencies();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/cryptocurrencies/${id}`);
            setCryptocurrencies(cryptocurrencies.filter((crypto) => crypto.id !== id));
        } catch (error) {
            console.error('Error deleting cryptocurrency:', error);
        }
    };

    return (
        <div>
            <h2>Cryptocurrency Management</h2>
            <ul>
                {cryptocurrencies.map((crypto) => (
                    <li key={crypto.id}>
                        {crypto.name} ({crypto.symbol})
                        <button onClick={() => handleDelete(crypto.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListCryptocurrencies;
