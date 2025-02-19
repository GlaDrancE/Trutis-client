import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getQrId } from '../../services/api';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType'); 
    const [qrId, setQrId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {
                    const response = await getQrId(token);
                    const data = await response.data;
                    setQrId(data.qr_id);
                    console.log(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userType === 'staff') {
        return <Navigate to={`/${localStorage.getItem('clientId')}`} replace />;
    }

    if (!qrId) {
        return <Navigate to="/add-card" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;