import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';

interface CustomJwtPayload extends JwtPayload {
    userType?: string;
}

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [isNavigated, setIsNavigated] = useState(false);

    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decode = jwtDecode<CustomJwtPayload>(token);
        if (decode.exp && Date.now() >= decode.exp * 1000) {
            console.error('Token has expired');
            return <Navigate to="/login" replace />;
        }
        
        const userType = decode.userType;
        const clientId = localStorage.getItem('clientId');
        console.log("userType: ", userType);

        if (userType === 'staff') {
            if (!clientId) {
                console.error('Client ID is missing for staff user');
                return <Navigate to="/login" replace />;
            }

            useEffect(() => {
                navigate(`/${clientId}`, { replace: true });
                setIsNavigated(true);
            }, [clientId, navigate]);

            if (isNavigated) {
                return <HomePage />;
            }
            return null; 
        }
        
        return <Outlet />;
    } catch (error) {
        console.error('Error decoding token:', error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
