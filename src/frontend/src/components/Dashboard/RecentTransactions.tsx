import * as React from 'react';
const RecentTransactions: React.FC = () => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Recent Transactions</h2>
            <ul>
                <li>Transaction #1: Completed</li>
                <li>Transaction #2: Pending</li>
                <li>Transaction #3: Failed</li>
            </ul>
        </div>
    );
};

export default RecentTransactions;
