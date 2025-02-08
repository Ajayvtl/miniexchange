import * as React from 'react';
import UserStats from './UserStats';
import CryptocurrencyStats from './CryptocurrencyStats';
import RecentTransactions from './RecentTransactions';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { permissions } = useAuth();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                {permissions.includes('Manage Users') && <UserStats />}
                {permissions.includes('Manage Cryptocurrencies') && <CryptocurrencyStats />}
            </div>
            {permissions.includes('View Reports') && <RecentTransactions />}
        </div>
    );
};

export default Dashboard;
