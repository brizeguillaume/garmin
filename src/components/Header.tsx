import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center md:hidden">
        <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className="flex-1 md:ml-8">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Fitness Analytics</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-600"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={toggleProfileMenu}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <UserIcon size={18} />
            </div>
            <span className="hidden md:inline font-medium">{user?.name}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Profile
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Settings
              </a>
              <button 
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;