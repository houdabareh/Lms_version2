import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext'; // Adjust path if necessary
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const Signup = () => {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState(''); // New state for Full Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // New state for Role
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [message, setMessage] = useState(null); // New state for messages (error/success)
  const [messageType, setMessageType] = useState(null); // New state for message type (error/success)
  const location = useLocation(); // Initialize useLocation
  const navigate = useNavigate(); // Initialize useNavigate
  const isCompactNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setMessageType(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }
    setIsLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token if backend returns one (optional for now)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage(data.message || 'Registration successful!');
        setMessageType('success');
        setTimeout(() => {
          if (data.user.role === 'student') {
            navigate('/student/dashboard');
          } else if (data.user.role === 'educator') {
            navigate('/educator/dashboard');
          }
        }, 1000); // Delay for user to see success message
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An unexpected error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'} font-inter`}>
      <Navbar isCompact={isCompactNavbar} /> {/* Use the imported Navbar with conditional prop */}

      <main className="flex-grow flex items-center justify-center p-4">
        <div className={`w-full max-w-md p-8 rounded-lg shadow-xl
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-3xl font-bold text-center mb-6
            bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Sign Up for GFS LMS
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-3 rounded-md text-center text-sm font-medium
                ${messageType === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
                {message}
              </div>
            )}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="John Doe"
                required
              />
            </div>
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="your@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">I am a:</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="educator">Educator</option>
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="********"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="********"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-md shadow-md
                hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105
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
                'Sign Up'
              )}
            </motion.button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </div>
        </div>
      </main>
      <Footer /> {/* Use the imported Footer */}
    </div>
  );
};

export default Signup;