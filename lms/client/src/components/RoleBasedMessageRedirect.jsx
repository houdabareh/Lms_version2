import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * RoleBasedMessageRedirect Component
 * 
 * Redirects users to the appropriate messaging interface based on their role:
 * - Students -> /student/messages
 * - Educators -> /educator/chat
 * - Admins -> /admin/dashboard (for now)
 */
const RoleBasedMessageRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'student':
      return <Navigate to="/student/messages" replace />;
    case 'educator':
      return <Navigate to="/educator/chat" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      // Fallback for unknown roles
      console.warn('Unknown user role:', user.role);
      return <Navigate to="/login" replace />;
  }
};

export default RoleBasedMessageRedirect; 