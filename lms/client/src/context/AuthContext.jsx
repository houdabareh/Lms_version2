import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to manually refresh user data
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const userData = await response.json();
      console.log('🔄 User data refreshed:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 AuthContext - Token check:', !!token);

    if (!token) {
      console.log('❌ No token found, setting loading to false');
      setLoading(false);
      return;
    }

    // Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log('🌐 AuthContext - Using API URL:', apiUrl);

    fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log('📡 AuthContext - Response status:', res.status);
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ AuthContext - User data received:', data);
        console.log('👤 User ID:', data._id);
        console.log('🎭 User role:', data.role);
        console.log('📧 User email:', data.email);
        setUser(data);
      })
      .catch(err => {
        console.error('❌ AuthContext error:', err.message);
        console.log('🗑️ Removing invalid token from localStorage');
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}; 