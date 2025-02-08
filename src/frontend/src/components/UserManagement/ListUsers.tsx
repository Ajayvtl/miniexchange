import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ListUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} ({user.email})
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListUsers;
