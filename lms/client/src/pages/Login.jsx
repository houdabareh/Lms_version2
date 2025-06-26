import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import logo from '../assets/logo.png'; // Reusing the logo for the 3D-style illustration placeholder
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext); // Use setUser from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // New state for messages (error/success)
  const [messageType, setMessageType] = useState(null); // New state for message type (error/success)
  const [otpSent, setOtpSent] = useState(false); // New state to track if OTP has been sent
  const [otp, setOtp] = useState(''); // New state for OTP input
  const [userId, setUserId] = useState(null); // New state to store userId for OTP verification
  const location = useLocation(); // Initialize useLocation
  const navigate = useNavigate(); // Initialize useNavigate
  const isCompactNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password'; // Determine if Navbar should be compact

  // Helper function for redirection based on role
  const redirectByRole = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'educator') {
      navigate('/educator');
    } else if (role === 'student') {
      navigate('/student/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setMessageType(null);
    
    try {
      // 🔐 Login attempt - OTP verification required for ALL users (students, educators, admins)
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful - OTP sent to email for students/educators
        if (data.userId) {
          setOtpSent(true);
          setUserId(data.userId);
          setMessage(data.message || 'OTP sent to your email. Please check your inbox.');
          setMessageType('success');
        }
      } else if (response.status === 403 && data.error === 'Admin users must use admin login') {
        // 🔐 Admin user detected - try admin login endpoint
        try {
          const adminResponse = await fetch('http://localhost:5000/api/auth/admin-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const adminData = await adminResponse.json();

          if (adminResponse.ok && adminData.userId) {
            // ✅ Admin login successful - OTP sent
            setOtpSent(true);
            setUserId(adminData.userId);
            setMessage('OTP sent to your admin email. Please check your inbox.');
            setMessageType('success');
          } else {
            setMessage(adminData.error || 'Admin login failed. Please try again.');
            setMessageType('error');
          }
        } catch (adminError) {
          console.error('Admin login error:', adminError);
          setMessage('Admin login failed. Please try again.');
          setMessageType('error');
        }
      } else {
        setMessage(data.error || 'Login failed. Please check your credentials.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An unexpected error occurred. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setMessageType(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔐 Store token based on user role (OTP verification for ALL users now)
        if (data.user.role === 'admin') {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); 
          setUser(data.user);
          setMessage('Admin login successful! Redirecting to dashboard...');
          setMessageType('success');
          setTimeout(() => {
            redirectByRole(data.user.role);
          }, 1000); 
        } else {
          // Students and educators get regular token
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user)); 
          setUser(data.user);
          setMessage(data.message || 'Login successful! Redirecting to your dashboard...');
          setMessageType('success');
          setTimeout(() => {
            redirectByRole(data.user.role);
          }, 1000); 
        }
      } else {
        setMessage(data.message || 'OTP verification failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage('An unexpected error occurred during OTP verification. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white'} font-inter`}>
      <Navbar isCompact={isCompactNavbar} /> {/* Pass isCompact prop */}
      
      <main className="flex-grow flex items-center justify-center p-4 mt-16"> {/* Added mt-16 to main to clear Navbar, kept flex centering and p-4 */}
        <div className={`relative flex flex-col md:flex-row w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

          {/* Left Side: Illustration Section */}
          <div className={`relative md:w-1/2 flex items-center justify-center p-8 md:p-12
            ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-primary to-accent-light'}
            text-white`}
          >
            {/* Subtle gradient background overlay for extra polish */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top left, var(--tw-gradient-stops))', '--tw-gradient-stops': 'rgba(255,255,255,0.2), transparent 70%' }}></div>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at bottom right, var(--tw-gradient-stops))', '--tw-gradient-stops': 'rgba(255,255,255,0.2), transparent 70%' }}></div>

            <div className="relative z-10 text-center">
              {/* 3D-style GFS LMS Logo placeholder */}
              <motion.img
                src={logo}
                alt="GFS LMS Logo 3D"
                className="w-48 md:w-64 mx-auto mb-8 drop-shadow-lg filter" // Filter for subtle glow/shadow
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 10px rgba(0, 123, 255, 0.5))' : 'drop-shadow(0 0 10px rgba(245, 175, 0, 0.5))' }} // Subtle glow
              />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }} // Assuming Poppins or Inter is available via global CSS or similar
              >
                "Empower Your Learning Journey with AI."
              </motion.h2>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className={`text-4xl font-extrabold text-center mb-8
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent`} // GFS LMS part uses gradient
            >
              Welcome Back to <span className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-yellow-500">GFS LMS</span>
            </h2>
            <form onSubmit={otpSent ? handleOtpVerification : handleSubmit} className="space-y-6">
              {message && (
                <div className={`p-3 rounded-md text-center text-sm font-medium
                  ${messageType === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
                  {message}
                </div>
              )}
              {!otpSent ? (
                <>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-primary-light' : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-primary'}
                        transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg`}
                      placeholder="your@example.com"
                      required
                      whileFocus={{ scale: 1.005 }}
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <motion.input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-primary-light' : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-primary'}
                        transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg`}
                      placeholder="********"
                      required
                      whileFocus={{ scale: 1.005 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center pt-8 text-sm leading-5
                        ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link to="/forgot-password" className={`text-sm font-medium hover:underline transition-colors duration-200
                      ${theme === 'dark' ? 'text-primary-light hover:text-accent-light' : 'text-primary hover:text-accent'}`}>
                      Forgot password?
                    </Link>
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="otp" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>OTP</label>
                  <motion.input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                      ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-primary-light' : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-primary'}
                      transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg`}
                    placeholder="Enter OTP"
                    required
                    maxLength="6"
                    whileFocus={{ scale: 1.005 }}
                  />
                </div>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg
                  hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  otpSent ? 'Verify OTP' : 'Login'
                )}
              </motion.button>
            </form>
            <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/signup" className={`font-semibold hover:underline transition-colors duration-200
                ${theme === 'dark' ? 'text-primary-light hover:text-accent-light' : 'text-primary hover:text-accent'}`}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* Use the imported Footer */}
    </div>
  );
};

export default Login;
