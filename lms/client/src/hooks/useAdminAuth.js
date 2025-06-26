import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get API base URL with fallback
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  };

  // Decode JWT token to get user info
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Set token in localStorage
  const setToken = (token) => {
    localStorage.setItem('adminToken', token);
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem('adminToken');
  };

  // Logout function
  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate('/login');
  }, [navigate]);

  // Verify admin role and token validity
  const verifyAdminAuth = () => {
    const token = getToken();
    
    if (!token) {
      setError('No authentication token found');
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
      return;
    }

    if (isTokenExpired(token)) {
      setError('Session expired. Please login again.');
      removeToken();
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
      return;
    }

    const decoded = decodeToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      removeToken();
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
      return;
    }

    // All checks passed
    setAdminUser({
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    });
    setIsAuthenticated(true);
    setError(null);
    setIsLoading(false);
  };

  // API call with authentication
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token');
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      console.log(`Making API call to: ${getApiUrl()}${endpoint}`);
      const response = await fetch(`${getApiUrl()}${endpoint}`, mergedOptions);
      
      if (response.status === 401) {
        // Token expired or invalid
        console.error('Authentication failed - token expired or invalid');
        logout();
        throw new Error('Session expired');
      }
      
      if (response.status === 403) {
        // Forbidden - not admin
        console.error('Access denied - insufficient privileges');
        logout();
        throw new Error('Access denied');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API call failed:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }, [logout]);

  // Admin login function - uses admin-login endpoint
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Attempting admin login to: ${getApiUrl()}/api/auth/admin-login`);
      
      // Step 1: Admin login and get OTP
      const loginResponse = await fetch(`${getApiUrl()}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        console.error('Admin login failed:', loginData);
        throw new Error(loginData.error || 'Admin login failed');
      }

      return { success: true, userId: loginData.userId };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  // Verify OTP and complete login
  const verifyOTP = async (userId, otp) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${getApiUrl()}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // Store token and verify admin role
      setToken(data.token);
      verifyAdminAuth();
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    verifyAdminAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    error,
    login,
    verifyOTP,
    logout,
    apiCall
  };
};

export default useAdminAuth; 