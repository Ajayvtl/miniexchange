import * as React from 'react';
const SideMenu: React.FC = () => {
    const role = 'Super Admin'; // Replace with actual role from context or state

    return (
        <div style={{ width: '200px', borderRight: '1px solid #ccc' }}>
            <h3>Menu</h3>
            <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                {role === 'Super Admin' && <li><a href="/manage-crypto">Manage Cryptocurrencies</a></li>}
                <li><a href="/users">Manage Users</a></li>
                <li><a href="/reports">Reports</a></li>
            </ul>
        </div>
    );
};

export default SideMenu;
