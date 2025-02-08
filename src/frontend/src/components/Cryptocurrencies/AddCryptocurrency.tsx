import * as React from 'react';
import { useState } from 'react'; // Correct placement
import axios from '../../services/api';

const AddCryptocurrency = () => {
    const [form, setForm] = useState({
        name: '',
        symbol: '',
        evmCompatible: false,
        rpcUrl: '',
        chainId: '',
        contractAddress: '',
        type: 'Coin',
        explorerUrl: '',
        transactionApi: '',
        apiKey: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setForm({
            ...form,
            [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/cryptocurrencies', form);
            alert('Cryptocurrency added successfully!');
        } catch (error) {
            console.error('Error adding cryptocurrency:', error);
            alert('Failed to add cryptocurrency.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="symbol" value={form.symbol} onChange={handleChange} placeholder="Symbol" required />
            <label>
                EVM Compatible:
                <input
                    type="checkbox"
                    name="evmCompatible"
                    checked={form.evmCompatible}
                    onChange={handleChange}
                />
            </label>
            <input name="rpcUrl" value={form.rpcUrl} onChange={handleChange} placeholder="RPC URL" />
            <input name="chainId" value={form.chainId} onChange={handleChange} placeholder="Chain ID" />
            <input
                name="contractAddress"
                value={form.contractAddress}
                onChange={handleChange}
                placeholder="Contract Address"
            />
            <select name="type" value={form.type} onChange={handleChange}>
                <option value="Coin">Coin</option>
                <option value="Token">Token</option>
            </select>
            <input
                name="explorerUrl"
                value={form.explorerUrl}
                onChange={handleChange}
                placeholder="Explorer URL"
            />
            <input
                name="transactionApi"
                value={form.transactionApi}
                onChange={handleChange}
                placeholder="Transaction API URL"
            />
            <input name="apiKey" value={form.apiKey} onChange={handleChange} placeholder="API Key" />
            <button type="submit">Add Cryptocurrency</button>
        </form>
    );
};

export default AddCryptocurrency;
