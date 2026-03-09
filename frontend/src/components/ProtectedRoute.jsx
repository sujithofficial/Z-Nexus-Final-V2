import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const adminInfo = localStorage.getItem('adminInfo');

    if (!adminInfo) {
        return <Navigate to="/system-access" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
