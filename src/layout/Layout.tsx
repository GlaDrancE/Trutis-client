import { useParams, useNavigate, Routes } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Link } from 'react-router-dom';
import useClient from '@/hooks/client-hook';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    BarChart,
    Home,
    Scan,
    LineChart,
    QrCode,
    Users,
    Star,
    Ticket,
    Gift,
    TrendingUp,
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    Menu,
    ChevronRight,
    Sun,
    Moon,
    X,
} from 'lucide-react';


import { ScrollArea } from '@/components/ui/scroll-area';
import { ShopDetailsModal } from '@/components/ShopDetailsModal';

interface LayoutProps {
    children: React.ReactNode;
}

interface CustomJwtPayload extends JwtPayload {
    userType?: string;
}

const notifications = [
    {
        id: 1,
        title: 'New Review',
        message: 'John Doe left a 5-star review',
        time: '2 minutes ago',
        unread: true,
    },
    {
        id: 2,
        title: 'Subscription Update',
        message: 'Premium plan subscription renewed',
        time: '1 hour ago',
        unread: true,
    },
    {
        
        id: 3,
        title: 'System Update',
        message: 'Dashboard v2.0 is now available',
        time: '2 hours ago',
        unread: false,
    },
];



// Navigation items grouped by section
const navigationItems = {
    main: [
        { icon: LineChart, label: 'Dashboard', id: 'dashboard', href: '/' },
        { icon: QrCode, label: 'QR Code', id: 'qr-code', href: '/coupon-scanner' },
        // { icon: Users, label: 'Customer Data', id: 'customers', href: '/customers' },
        { icon: Ticket, label: 'Subscriptions', id: 'subscriptions', href: '/subscription-plans' },
        { icon: Star, label: 'Reviews', id: 'reviews', href: '/review' },
        { icon: Ticket, label: 'Rewards', id: 'coupons', href: '/coupons' },
        // { icon: Gift, label: 'Rewards', id: 'rewards', href: '/gift' },
        { icon: TrendingUp, label: 'Marketing', id: 'marketing', href: '/marketing' },
    ],
    settings: [
        { icon: Settings, label: 'Settings', id: 'settings', href: '/settings' },
        { icon: Bell, label: 'Notification', id: 'notifications', href: '/notifaction' },
        { icon: HelpCircle, label: 'Help Center', id: 'help', href: '/help-center' },
    ],
};

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { client } = useClient();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [breadCrumbs, setBreadCrumbs] = useState<{ id: string, label: string }[]>([{ id: 'dashboard', label: "Dashboard" }]);




    // Handle responsive sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        document.documentElement.classList.add(sessionStorage.getItem('theme') || 'light');
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        const theme = sessionStorage.getItem('theme');
        sessionStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
        document.documentElement.classList.toggle('dark');
    };

    const handleNavigation = (sectionId: string, href: string, label: string) => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
        navigate(`/${id}${href}`)
        setActiveSection(sectionId);
        setBreadCrumbs([{ id: sectionId, label: label }]);
    };

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
                        {client?.isActive && client?.qr_id && (
                            <Link to={`/${id}/coupon-scanner`} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg">
                                <Scan className="text-blue-600" size={20} />
                                <span>QR Scanner</span>
                            </Link>
                        )}
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
                        {client?.isActive && client?.qr_id && (
                            <Link to={`/${id}/coupon-scanner`} className="flex flex-col items-center">
                                <Scan className="text-blue-600" size={20} />
                                <span className="text-xs mt-1">QR Scanner</span>
                            </Link>
                        )}
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
            <ShopDetailsModal />
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-40 h-screen w-[280px] transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } bg-card border-r lg:translate-x-0`}>
                <ScrollArea className="h-full px-6 py-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Entrego</span>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto lg:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>

                    {/* Main Navigation */}
                    <nav className="space-y-2">
                        {navigationItems.main.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeSection === item.id ? "secondary" : "ghost"}
                                className="w-full justify-start gap-3 h-11 transition-colors"
                                onClick={() => handleNavigation(item.id, item.href, item.label)}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>

                    {/* Settings Section */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Settings</h3>
                        <nav className="space-y-2">
                            {navigationItems.settings.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={activeSection === item.id ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-3 h-11 transition-colors"
                                    onClick={() => handleNavigation(item.id, item.href, item.label)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            ))}
                        </nav>
                    </div>

                    {/* Account Section */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Account</h3>
                        <Button variant={'ghost'} className="flex items-center gap-3 mb-4 px-3 py-8 w-full" onClick={() => navigate(`/${id}/profile`)}>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>PR</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{client?.owner_name}</p>
                                <p className="text-xs text-muted-foreground">{client?.email}</p>
                            </div>
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-11"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </ScrollArea>
            </aside>

            {/* 
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
            </div> */}

            <main className={`${isMobile ? 'ml-0' : 'lg:ml-[280px]'} bg-background transition-[margin] duration-200 ease-in-out min-h-screen flex flex-col`}>

                {/* Header */}
                <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur-sm">
                    <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>

                        <nav className="hidden sm:flex items-center gap-1 text-sm">

                            {
                                breadCrumbs.map((crumb, index) => (
                                    <Fragment key={crumb.id}>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        <Button variant="ghost" className="h-8">{crumb.label}</Button>
                                    </Fragment>
                                ))
                            }
                        </nav>

                        <div className="ml-auto flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9"
                            >
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Notifications</SheetTitle>
                                    </SheetHeader>
                                    <ScrollArea className="h-[calc(100vh-5rem)] mt-4">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 mb-2 rounded-lg ${notification.unread ? 'bg-primary/5' : 'bg-background'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-medium">{notification.title}</h4>
                                                    {notification.unread && (
                                                        <span className="h-2 w-2 bg-primary rounded-full" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </span>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;