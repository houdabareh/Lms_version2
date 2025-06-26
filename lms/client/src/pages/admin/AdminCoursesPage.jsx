import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaBook, FaUser, FaClock } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useTheme } from '../../context/ThemeContext';

const CourseCard = ({ course, onApprove, onReject, index }) => {
  const { isDark } = useTheme();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800';
      case 'rejected':
        return isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800';
      default:
        return isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-600' 
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Course Image/Icon */}
      <div className={`w-full h-40 rounded-lg mb-4 flex items-center justify-center ${
        isDark ? 'bg-neutral-700' : 'bg-neutral-100'
      }`}>
        <FaBook className={`w-12 h-12 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
      </div>

      {/* Course Title */}
      <h3 className={`font-semibold text-lg mb-2 ${
        isDark ? 'text-white' : 'text-neutral-900'
      }`}>
        {course.title}
      </h3>

      {/* Educator Info */}
      <div className="flex items-center gap-2 mb-3">
        <FaUser className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {course.educator?.name || 'Unknown Educator'}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
          {course.status || 'pending'}
        </span>
        <div className="flex items-center gap-1">
          <FaClock className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 line-clamp-2 ${
        isDark ? 'text-neutral-400' : 'text-neutral-600'
      }`}>
        {course.description || 'No description available'}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => console.log('View course:', course._id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-1 ${
            isDark 
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          <FaEye className="w-3 h-3" />
          View
        </motion.button>
        
        {course.status === 'pending' && (
          <>
            <motion.button
              onClick={() => onApprove(course._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-1 ${
                isDark 
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              <FaCheck className="w-3 h-3" />
              Approve
            </motion.button>
            <motion.button
              onClick={() => onReject(course._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-1 ${
                isDark 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              <FaTimes className="w-3 h-3" />
              Reject
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default function AdminCoursesPage() {
  const { isDark } = useTheme();
  const { apiCall } = useAdminAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch courses data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/api/admin/courses');
        setCourses(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [apiCall]);

  // Handle course approval
  const handleApprove = async (courseId) => {
    try {
      await apiCall(`/api/admin/courses/${courseId}/approve`, { method: 'PUT' });
      setCourses(courses.map(course => 
        course._id === courseId ? { ...course, status: 'approved' } : course
      ));
    } catch (err) {
      console.error('Failed to approve course:', err);
      alert('Failed to approve course: ' + err.message);
    }
  };

  // Handle course rejection
  const handleReject = async (courseId) => {
    const reason = prompt('Please provide a rejection reason:');
    if (!reason) return;

    try {
      await apiCall(`/api/admin/courses/${courseId}/reject`, { 
        method: 'PUT',
        body: JSON.stringify({ reason })
      });
      setCourses(courses.map(course => 
        course._id === courseId ? { ...course, status: 'rejected' } : course
      ));
    } catch (err) {
      console.error('Failed to reject course:', err);
      alert('Failed to reject course: ' + err.message);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.educator?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminProtectedRoute>
      <PageTransition pageName="Courses">
        <div className={`min-h-screen flex transition-colors duration-300 ${
          isDark ? 'bg-neutral-900' : 'bg-neutral-50'
        }`}>
          <AdminSidebar active="Courses" />
          
          {/* Main Content */}
          <div className="flex-1 ml-72">
            <AdminNavbar />
            
            <main className="p-6">
              {/* Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-start"
                >
                  <div>
                    <h1 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      Course Management
                    </h1>
                    <p className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Review and manage course submissions
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl border p-6 mb-6 ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`} />
                    <input
                      id="admin-course-search"
                      name="adminCourseSearch"
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2.5 w-full rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        isDark 
                          ? 'bg-neutral-900 border-neutral-600 text-white placeholder-neutral-400' 
                          : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-500'
                      }`}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex gap-3">
                    <select
                      id="admin-course-status-filter"
                      name="adminCourseStatusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        isDark 
                          ? 'bg-neutral-900 border-neutral-600 text-white' 
                          : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                      }`}
                    >
                      <option value="All">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Courses Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {loading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className={`p-6 rounded-xl border animate-pulse ${
                      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                    }`}>
                      <div className={`w-full h-40 rounded-lg mb-4 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                      <div className={`h-4 rounded mb-2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                      <div className={`h-3 rounded w-3/4 mb-4 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                    </div>
                  ))
                ) : error ? (
                  <div className="col-span-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="text-red-500 mb-2">Failed to load courses</p>
                      <p className="text-sm text-neutral-500">{error}</p>
                    </div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center p-8">
                    <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>No courses found</p>
                  </div>
                ) : (
                  filteredCourses.map((course, index) => (
                    <CourseCard 
                      key={course._id} 
                      course={course} 
                      index={index}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </PageTransition>
    </AdminProtectedRoute>
  );
} 