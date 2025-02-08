import * as React from 'react';
import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    role: string;
    permissions: string[];
    setAuthData: (token: string, role: string, permissions: string[]) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string>(''); // e.g., "Admin" or "Super Admin"
    const [permissions, setPermissions] = useState<string[]>([]);

    const setAuthData = (token: string, role: string, permissions: string[]) => {
        setToken(token);
        setRole(role);
        setPermissions(permissions);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('permissions', JSON.stringify(permissions));
    };

    const logout = () => {
        setToken(null);
        setRole('');
        setPermissions([]);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('permissions');
    };

    return (
        <AuthContext.Provider value={{ token, role, permissions, setAuthData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
