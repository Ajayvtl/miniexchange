import * as React from 'react';
const UserStats: React.FC = () => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Total Users</h2>
            <p>Super Admin: 5</p>
            <p>Admin: 10</p>
        </div>
    );
};

export default UserStats;
