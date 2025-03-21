import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Cards from '../pages/Cards';
import Payments from '../pages/Payments';

// Componente de rota protegida
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

// Componente de rotas
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <PrivateRoute>
                        <Users />
                    </PrivateRoute>
                }
            />
            <Route
                path="/cards"
                element={
                    <PrivateRoute>
                        <Cards />
                    </PrivateRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <PrivateRoute>
                        <Payments />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes; 