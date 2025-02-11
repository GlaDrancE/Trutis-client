import React from 'react'
import { Home, User, Settings } from 'lucide-react'
// Types for navigation items
type NavItem = {
    icon: React.ReactNode;
    label: string;
    path: string;
};

// Bottom Navigation Component
const BottomNav = () => {
    const navItems: NavItem[] = [
        { icon: <Home size={24} />, label: 'Home', path: '/' },
        { icon: <User size={24} />, label: 'Profile', path: '/profile' },
        { icon: <Settings size={24} />, label: 'Settings', path: '/settings' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className="flex flex-col items-center justify-center flex-1 text-blue-600 hover:text-blue-800"
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};
export default BottomNav