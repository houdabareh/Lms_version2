import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { MoonIcon, SunIcon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.png';
import profileImg from '../../assets/profile_img3.png';

const EducatorNavbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md dark:bg-darkBg border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 w-full z-30 h-16">
      <div className="px-6 h-full flex justify-between items-center">
        
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 pl-2 lg:pl-0">
          <Link to="/educator" className="flex items-center gap-2">
            <img src={logo} alt="GFS LMS Logo" className="h-8" />
            <span className="text-2xl font-extrabold text-primary dark:text-accent">GFS LMS</span>
          </Link>
        </div>

        {/* Right: Theme Toggle, Notification, Profile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>

          <button
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-accent focus:outline-none group rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] px-2 py-1"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <img
                className="h-9 w-9 rounded-full object-cover border-2 border-primary dark:border-accent group-hover:border-accent dark:group-hover:border-primary transition-colors duration-200"
                src={profileImg}
                alt="User Profile"
              />
              <span className="font-medium text-sm hidden sm:block">John Doe</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-200" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-40">
                <Link to="/educator/yourprofile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Your Profile</Link>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EducatorNavbar;
