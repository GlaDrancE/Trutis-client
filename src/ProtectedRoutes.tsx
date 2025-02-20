import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (userType === 'staff') {
        return <Navigate to={`/${localStorage.getItem('clientId')}`} replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;