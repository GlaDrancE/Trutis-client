import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If token is found, render the child components
    return <Outlet />;
};

export default ProtectedRoute;