import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, LightbulbFilament, Sun, MoonStars } from '@phosphor-icons/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../context/ThemeContext';
import logo from '../assets/logo.png';

const Navbar = ({ isCompact = false }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '#contact' }, // Assuming #contact is handled within homepage or a generic contact section
  ];

  const navbarHeightClass = isCompact ? 'py-1' : 'py-4';
  const logoSizeClass = isCompact ? 'h-6' : 'h-9';
  const fontSizeClass = isCompact ? 'text-lg' : 'text-3xl';

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 ${navbarHeightClass} shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900 bg-opacity-90 backdrop-blur-md' : 'bg-white bg-opacity-90 backdrop-blur-md'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`${fontSizeClass} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent transition-all duration-300 transform hover:scale-105`}>GFS</Link>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className={`text-lg font-medium transition-all duration-300 relative group ${theme === 'dark' ? 'text-gray-200 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
              {link.name}
              <span className={`absolute left-0 bottom-0 w-full h-0.5 transition-all duration-300 origin-left transform scale-x-0 group-hover:scale-x-100 ${theme === 'dark' ? 'bg-primary' : 'bg-primary'}`}></span>
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {theme === 'dark' ? <Sparkle className="h-6 w-6" /> : <LightbulbFilament className="h-6 w-6" />}
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-md transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {isMobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden px-6 pb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex flex-col space-y-3 mt-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className={`block text-lg font-medium py-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  {link.name}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-full px-4 py-2 rounded-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {theme === 'dark' ? <Sparkle className="h-6 w-6 mr-2" /> : <LightbulbFilament className="h-6 w-6 mr-2" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 