import React, { useState } from 'react'
import { Home, User, Settings } from 'lucide-react'
import { useParams } from 'react-router-dom';
type NavItem = {
    icon: React.ReactNode;
    label: string;
    path: string;
};
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { id } = useParams();
    console.log(id)
    const navItems: NavItem[] = [
        { icon: <Home size={24} />, label: 'Home', path: `/${id}` },
        { icon: <User size={24} />, label: 'Profile', path: `/${id}/profile` },
        { icon: <Settings size={24} />, label: 'Settings', path: `/${id}/settings` }
    ];

    return (
        <div className="hidden md:block">
            <nav className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 p-4`}>
                <div className="flex flex-col space-y-6">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            className="flex items-center space-x-4 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};
export default Sidebar