import { Home, User, Settings } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {jwtDecode,JwtPayload } from 'jwt-decode';

interface LayoutProps {
    children: React.ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
    userType?: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    let userType;

    if (token) {
        try {
            const decode = jwtDecode<CustomJwtPayload>(token);
            userType = decode.userType;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    if (userType === 'staff') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <aside className="fixed left-0 top-0 hidden md:flex flex-col w-64 h-screen bg-white border-r">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-blue-600">Trutis</h2>
                </div>
                <nav className="flex-1 p-4">
                    <a href={`/${id}`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <Home className="text-blue-600" size={20} />
                        <span>Home</span>
                    </a>
                    <a href={`/${id}/profile`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <User className="text-blue-600" size={20} />
                        <span>Profile</span>
                    </a>
                    <a href={`/${id}/settings`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <Settings className="text-blue-600" size={20} />
                        <span>Settings</span>
                    </a>
                </nav>
            </aside>

            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t">
                <nav className="flex justify-around p-4">
                    <a href={`/${id}`} className="flex flex-col items-center">
                        <Home className="text-blue-600" size={20} />
                        <span className="text-xs mt-1">Home</span>
                    </a>
                    <a href={`/${id}/profile`} className="flex flex-col items-center">
                        <User className="text-blue-600" size={20} />
                        <span>Profile</span>
                    </a>
                    <a href={`/${id}/settings`} className="flex flex-col items-center">
                        <Settings className="text-blue-600" size={20} />
                        <span>Settings</span>
                    </a>
                </nav>
            </div>

            <main className="md:ml-64 p-4 pb-20 md:pb-4">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
