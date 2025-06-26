import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuth from '../../hooks/useAdminAuth';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAdminAuth();
  const { isDark } = useTheme();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className={`w-12 h-12 border-4 border-transparent rounded-full ${
              isDark ? 'border-t-blue-400' : 'border-t-blue-600'
            }`}></div>
          </motion.div>
          <motion.p 
            className={`text-lg font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Verifying admin access...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Show error message if authentication failed
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
        <motion.div 
          className={`text-center space-y-4 p-8 rounded-xl border max-w-md mx-auto ${
            isDark 
              ? 'bg-neutral-800 border-neutral-700 text-white' 
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
          <p className={`${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
            {error}
          </p>
          <motion.button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default AdminProtectedRoute; 