import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ListTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({ status: '', cryptocurrency: '' });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/transactions', { params: filters });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Transaction Management</h2>
            <div>
                <label>Status:</label>
                <select name="status" onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Failed">Failed</option>
                </select>
                <input
                    name="cryptocurrency"
                    placeholder="Cryptocurrency"
                    onChange={handleFilterChange}
                />
            </div>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.amount} {transaction.cryptocurrency} ({transaction.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListTransactions;
