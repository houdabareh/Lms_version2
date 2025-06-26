import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext'; // Adjust path if necessary
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const ForgotPassword = () => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const location = useLocation(); // Initialize useLocation
  const isCompactNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    console.log('Password reset request for:', { email });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false); // End loading
    alert('Password reset functionality not yet implemented. Check console for dummy email.');
    // Add actual password reset logic here later
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'} font-inter`}>
      <Navbar isCompact={isCompactNavbar} /> {/* Use the imported Navbar with conditional prop */}

      <main className="flex-grow flex items-center justify-center p-4">
        <div className={`w-full max-w-md p-8 rounded-lg shadow-xl
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-3xl font-bold text-center mb-6
            bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Forgot Password?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="your@example.com"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-md shadow-md
                hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105
                flex items-center justify-center" // Center content for spinner
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>
          <div className="mt-6 text-center text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </div>
        </div>
      </main>
      <Footer /> {/* Use the imported Footer */}
    </div>
  );
};

export default ForgotPassword;
