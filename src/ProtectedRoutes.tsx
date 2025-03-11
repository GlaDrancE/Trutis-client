import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import CouponScanner from './pages/CouponScanner';
import DashboardLayout from './layout/Layout';

interface CustomJwtPayload extends JwtPayload {
    userType?: string;
}

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let userType: string | undefined;
    let clientId: string | null;

    try {
        const decode = jwtDecode<CustomJwtPayload>(token);
        if (decode.exp && Date.now() >= decode.exp * 1000) {
            console.error('Token has expired');
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        userType = decode.userType;
        clientId = localStorage.getItem('clientId');
    } catch (error) {
        console.error('Error decoding token:', error);
        return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        if (userType === 'staff' && clientId && location.pathname === `/${clientId}`) {
            navigate(`/${clientId}`, { replace: true });
        }
    }, [userType, clientId, location.pathname, navigate]);

    if (userType === 'staff') {
        if (!clientId) {
            console.error('Client ID is missing for staff user');
            return <Navigate to="/login" replace />;
        }

        const allowedPaths = [`/${clientId}`, `/${clientId}/coupon-scanner`];
        const currentPath = location.pathname;

        if (!allowedPaths.includes(currentPath)) {
            return <Navigate to={`/${clientId}`} replace />;
        }

        if (currentPath === `/${clientId}`) {
            return <HomePage />;
        }
        if (currentPath === `/${clientId}/coupon-scanner`) {
            return <CouponScanner />;
        }

        return null;
    }


    return <DashboardLayout><Outlet /></DashboardLayout>;
};

export default ProtectedRoute;