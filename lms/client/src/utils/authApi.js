// 🔐 Authenticated API utility for making requests with proper token headers

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get the appropriate token based on user role
export const getAuthToken = () => {
  // Try admin token first, then regular token
  return localStorage.getItem('adminToken') || localStorage.getItem('token');
};

// Make authenticated API call
export const authApiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    if (response.status === 401) {
      // Token expired - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    
    if (response.status === 403) {
      throw new Error('Access denied');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Specific API functions for common operations

// 📊 Dashboard APIs
export const fetchDashboardStats = () => authApiCall('/api/admin/dashboard');

// 👥 User APIs  
export const fetchUsers = (page = 1, limit = 10) => 
  authApiCall(`/api/admin/users?page=${page}&limit=${limit}`);

// 📚 Course APIs
export const fetchCourses = () => authApiCall('/api/admin/courses');
export const approveCourse = (courseId) => 
  authApiCall(`/api/admin/courses/${courseId}/approve`, { method: 'PUT' });
export const rejectCourse = (courseId, reason) => 
  authApiCall(`/api/admin/courses/${courseId}/reject`, { 
    method: 'PUT',
    body: JSON.stringify({ reason })
  });

// 📈 Analytics APIs
export const fetchAnalytics = () => authApiCall('/api/admin/analytics');

// 🔒 Login logs
export const fetchLoginLogs = (page = 1, limit = 20) =>
  authApiCall(`/api/admin/login-logs?page=${page}&limit=${limit}`);

// 🎓 Student/Educator APIs (for regular users)
export const fetchMyCourses = () => authApiCall('/api/courses');
export const fetchMyEnrollments = () => authApiCall('/api/enrollments');

export default authApiCall; 