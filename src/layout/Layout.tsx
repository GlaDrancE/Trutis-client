import { Home, LogOut, Settings, User, Scan } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Link } from 'react-router-dom';
interface LayoutProps {
    children: React.ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
    userType?: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (userType === 'staff') {
        return (
            <div className="min-h-screen bg-gray-50">
                <aside className="fixed left-0 top-0 hidden md:flex flex-col w-64 h-screen bg-white border-r">
                    <div className="p-4">
                        <h2 className="text-xl font-bold text-blue-600">Trutis Staff</h2>
                    </div>
                    <nav className="flex-1 p-4">
                        <Link to={`/${id}`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                            <Home className="text-blue-600" size={20} />
                            <span>Home</span>
                        </Link>
                        <Link to={`/${id}/coupon-scanner`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                            <Scan className="text-blue-600" size={20} />
                            <span>QR Scanner</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg w-full text-left">
                            <LogOut className="text-blue-600" size={20} />
                            <span>Logout</span>
                        </button>
                    </nav>
                </aside>

                <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t">
                    <nav className="flex justify-around p-4">
                        <Link to={`/${id}`} className="flex flex-col items-center">
                            <Home className="text-blue-600" size={20} />
                            <span className="text-xs mt-1">Home</span>
                        </Link>
                        <Link to={`/${id}/coupon-scanner`} className="flex flex-col items-center">
                            <Scan className="text-blue-600" size={20} />
                            <span className="text-xs mt-1">QR Scanner</span>
                        </Link>
                        <button onClick={handleLogout} className="flex flex-col items-center">
                            <LogOut className="text-blue-600" size={20} />
                            <span className="text-xs mt-1">Logout</span>
                        </button>
                    </nav>
                </div>

                <main className="md:ml-64 p-4 pb-20 md:pb-4">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <aside className="fixed left-0 top-0 hidden md:flex flex-col w-64 h-screen bg-white border-r">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-blue-600">Trutis</h2>
                </div>
                <nav className="flex-1 p-4">
                    <Link to={`/${id}`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <Home className="text-blue-600" size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to={`/${id}/profile`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <User className="text-blue-600" size={20} />
                        <span>Profile</span>
                    </Link>

                    <Link to={`/${id}/coupon-scanner`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <Scan className="text-blue-600" size={20} />
                        <span>QR Scanner</span>
                    </Link>
                    <Link to={`/${id}/settings`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                        <Settings className="text-blue-600" size={20} />
                        <span>Settings</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg w-full text-left">
                        <LogOut className="text-blue-600" size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t">
                <nav className="flex justify-around p-4">
                    <Link to={`/${id}`} className="flex flex-col items-center">
                        <Home className="text-blue-600" size={20} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link to={`/${id}/profile`} className="flex flex-col items-center">
                        <User className="text-blue-600" size={20} />
                        <span>Profile</span>
                    </Link>

                    <Link to={`/${id}/coupon-scanner`} className="flex flex-col items-center">
                        <Scan className="text-blue-600" size={20} />
                        <span className="text-xs mt-1">QR Scanner</span>
                    </Link>
                    <Link to={`/${id}/settings`} className="flex flex-col items-center">
                        <Settings className="text-blue-600" size={20} />
                        <span>Settings</span>
                    </Link>
                    <button onClick={handleLogout} className="flex flex-col items-center">
                        <LogOut className="text-blue-600" size={20} />
                        <span className="text-xs mt-1">Logout</span>
                    </button>
                </nav>
            </div>

            <main className="md:ml-64 p-4 pb-20 md:pb-4">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;