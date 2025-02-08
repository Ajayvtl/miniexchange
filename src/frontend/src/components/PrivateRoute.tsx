import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
    const { token } = useAuth();

    // Redirect to login if token is not available
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
