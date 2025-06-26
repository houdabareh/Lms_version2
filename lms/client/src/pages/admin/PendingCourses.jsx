import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaEye, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaSpinner, FaPlay, FaFileAlt, FaChevronDown, FaChevronUp, FaBookOpen, FaTable, FaTh } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useTheme } from '../../context/ThemeContext';

const StatusBadge = ({ status }) => {
  const { isDark } = useTheme();
  
  const statusStyles = {
    'pending': isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    'approved': isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800',
    'rejected': isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.pending}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </span>
  );
};

const CourseCardExpanded = ({ course, index, onApprove, onReject, onView, loading }) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApprove = async () => {
    if (loading) return;
    await onApprove(course._id);
  };

  const handleReject = async () => {
    if (loading) return;
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      await onReject(course._id, reason.trim());
    }
  };

  const handleView = () => {
    if (loading) return;
    onView(course._id);
  };

  const getTotalLessons = () => {
    if (!course.curriculum) return 0;
    return course.curriculum.reduce((total, section) => total + (section.lessons?.length || 0), 0);
  };

  const getTotalVideos = () => {
    if (!course.curriculum) return 0;
    return course.curriculum.reduce((total, section) => {
      return total + (section.lessons?.filter(lesson => lesson.videoUrl)?.length || 0);
    }, 0);
  };

  const getTotalMaterials = () => {
    if (!course.curriculum) return 0;
    return course.curriculum.reduce((total, section) => {
      return total + (section.lessons?.filter(lesson => lesson.materialUrl)?.length || 0);
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border overflow-hidden shadow-lg ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      }`}
    >
      {/* Course Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Thumbnail */}
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isDark ? 'bg-neutral-700' : 'bg-neutral-100'
            }`}>
              {course.thumbnailUrl ? (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <FaBookOpen className={`w-6 h-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  {course.title}
                </h3>
                <StatusBadge status={course.status} />
              </div>
              
              <p className={`text-sm mb-3 line-clamp-2 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {course.description || 'No description provided'}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaUser className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                    {course.educator?.name || 'Unknown Educator'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  ${course.price || '0'}
                </span>
              </div>

              {/* Content Stats */}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className={`flex items-center gap-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  <FaBookOpen className="w-3 h-3" />
                  <span>{course.curriculum?.length || 0} sections</span>
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  <FaPlay className="w-3 h-3" />
                  <span>{getTotalLessons()} lessons</span>
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  <FaPlay className="w-3 h-3" />
                  <span>{getTotalVideos()} videos</span>
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  <FaFileAlt className="w-3 h-3" />
                  <span>{getTotalMaterials()} materials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {/* Expand/Collapse Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300' 
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
            </motion.button>

            {/* View Details Button */}
            <motion.button
              onClick={handleView}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`p-2 rounded-lg transition-colors ${
                loading 
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
              }`}
            >
              <FaEye className="w-4 h-4" />
            </motion.button>

            {/* Approve Button */}
            {course.status === 'pending' && (
              <motion.button
                onClick={handleApprove}
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`p-2 rounded-lg transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                      : 'bg-green-100 hover:bg-green-200 text-green-600'
                }`}
              >
                <FaCheck className="w-4 h-4" />
              </motion.button>
            )}

            {/* Reject Button */}
            {course.status === 'pending' && (
              <motion.button
                onClick={handleReject}
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`p-2 rounded-lg transition-colors ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                      : 'bg-red-100 hover:bg-red-200 text-red-600'
                }`}
              >
                <FaTimes className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content - Curriculum Overview */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className={`border-t p-6 ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
          <h4 className={`text-sm font-medium mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Course Curriculum Preview
          </h4>
          
          {course.curriculum && course.curriculum.length > 0 ? (
            <div className="space-y-3">
              {course.curriculum.map((section, sectionIndex) => (
                <div 
                  key={sectionIndex}
                  className={`p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-neutral-700/50 border-neutral-600' 
                      : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {section.title || `Section ${sectionIndex + 1}`}
                    </h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDark ? 'bg-neutral-600 text-neutral-300' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {section.lessons?.length || 0} lessons
                    </span>
                  </div>
                  
                  {section.lessons && section.lessons.length > 0 && (
                    <div className="space-y-2">
                      {section.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            isDark ? 'bg-neutral-800/50' : 'bg-white/50'
                          }`}
                        >
                          <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                            {lesson.title || `Lesson ${lessonIndex + 1}`}
                          </span>
                          <div className="flex items-center gap-2">
                            {lesson.videoUrl && (
                              <div className={`flex items-center gap-1 text-xs ${
                                isDark ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                <FaPlay className="w-2 h-2" />
                                <span>Video</span>
                              </div>
                            )}
                            {lesson.materialUrl && (
                              <div className={`flex items-center gap-1 text-xs ${
                                isDark ? 'text-purple-400' : 'text-purple-600'
                              }`}>
                                <FaFileAlt className="w-2 h-2" />
                                <span>Material</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {section.lessons.length > 3 && (
                        <p className={`text-xs text-center pt-2 ${
                          isDark ? 'text-neutral-500' : 'text-neutral-500'
                        }`}>
                          ... and {section.lessons.length - 3} more lessons
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm text-center py-4 ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              No curriculum content available
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CourseRow = ({ course, index, onApprove, onReject, onView, loading }) => {
  const { isDark } = useTheme();

  const handleApprove = async () => {
    if (loading) return;
    await onApprove(course._id);
  };

  const handleReject = async () => {
    if (loading) return;
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      await onReject(course._id, reason.trim());
    }
  };

  const handleView = () => {
    if (loading) return;
    onView(course._id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b transition-colors hover:shadow-sm ${
        isDark 
          ? 'border-neutral-700 hover:bg-neutral-800/50' 
          : 'border-neutral-200 hover:bg-neutral-50'
      }`}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isDark ? 'bg-neutral-700' : 'bg-neutral-100'
          }`}>
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <FaUser className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
            )}
          </div>
          <div>
            <h3 className={`font-medium text-sm ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {course.title}
            </h3>
            <p className={`text-xs ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {course.category || 'General'}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <FaUser className={`w-3 h-3 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`} />
          <span className={`text-sm ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            {course.educator?.name || 'Unknown Educator'}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className={`w-3 h-3 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`} />
          <span className={`text-sm ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="p-4">
        <span className={`text-sm font-medium ${
          isDark ? 'text-green-400' : 'text-green-600'
        }`}>
          ${course.price || '0'}
        </span>
      </td>
      <td className="p-4">
        <StatusBadge status={course.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          {/* View Button */}
          <motion.button
            onClick={handleView}
            disabled={loading}
            whileHover={!loading ? { 
              scale: 1.1,
              boxShadow: isDark 
                ? "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                : "0 10px 25px -5px rgba(59, 130, 246, 0.2)"
            } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
              loading 
                ? 'opacity-50 cursor-not-allowed'
                : isDark 
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 shadow-lg' 
                  : 'bg-blue-50/80 border-blue-200/50 text-blue-600 hover:bg-blue-100/80 shadow-lg'
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <FaEye className="w-4 h-4 relative z-10" />
          </motion.button>

          {/* Approve Button */}
          <motion.button
            onClick={handleApprove}
            disabled={loading || course.status !== 'pending'}
            whileHover={!loading && course.status === 'pending' ? { 
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)"
            } : {}}
            whileTap={!loading && course.status === 'pending' ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
              loading || course.status !== 'pending'
                ? 'opacity-50 cursor-not-allowed'
                : isDark 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 shadow-lg shadow-green-500/10' 
                  : 'bg-green-50/80 border-green-200/50 text-green-600 hover:bg-green-100/80 shadow-lg shadow-green-500/10'
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div
              whileHover={!loading && course.status === 'pending' ? { rotate: 360 } : {}}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <FaCheck className="w-4 h-4" />
            </motion.div>
          </motion.button>

          {/* Reject Button */}
          <motion.button
            onClick={handleReject}
            disabled={loading || course.status !== 'pending'}
            whileHover={!loading && course.status === 'pending' ? { 
              scale: 1.1,
              boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)"
            } : {}}
            whileTap={!loading && course.status === 'pending' ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 group relative overflow-hidden ${
              loading || course.status !== 'pending'
                ? 'opacity-50 cursor-not-allowed'
                : isDark 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 shadow-lg shadow-red-500/10' 
                  : 'bg-red-50/80 border-red-200/50 text-red-600 hover:bg-red-100/80 shadow-lg shadow-red-500/10'
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div
              whileHover={!loading && course.status === 'pending' ? { rotate: 90 } : {}}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <FaTimes className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function PendingCourses() {
  const { isDark } = useTheme();
  const { apiCall } = useAdminAuth();
  const navigate = useNavigate();
  
  // State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get pending courses specifically
      let endpoint = '/api/admin/courses';
      if (statusFilter !== 'All') {
        endpoint += `/status/${statusFilter.toLowerCase()}`;
      }
      
      const response = await apiCall(endpoint);
      setCourses(response.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(err.message);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  // Handle course approval
  const handleApprove = async (courseId) => {
    try {
      setActionLoading(true);
      await apiCall(`/api/admin/courses/${courseId}/approve`, {
        method: 'PUT'
      });
      
      toast.success('Course approved successfully!');
      await fetchCourses(); // Refresh the list
    } catch (err) {
      console.error('Failed to approve course:', err);
      toast.error('Failed to approve course');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle course rejection
  const handleReject = async (courseId, reason) => {
    try {
      setActionLoading(true);
      await apiCall(`/api/admin/courses/${courseId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });
      
      toast.success('Course rejected successfully!');
      await fetchCourses(); // Refresh the list
    } catch (err) {
      console.error('Failed to reject course:', err);
      toast.error('Failed to reject course');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle course view
  const handleView = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  // Filter courses based on search term and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.educator?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || 
      course.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminProtectedRoute>
      <PageTransition pageName="Courses">
        <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${
          isDark ? 'bg-neutral-900' : 'bg-neutral-50'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-40 right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-40 left-40 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            />
          </div>

          <AdminSidebar active="Courses" />
          
          {/* Main Content */}
          <div className="flex-1 ml-72 relative z-10">
            <AdminNavbar />
            
            <main className="p-8">
              {/* Header */}
              <div className="mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.h1 
                    className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
                  >
                    Pending Courses
                  </motion.h1>
                  <motion.p 
                    className={`text-lg ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Review and manage course submissions from educators
                  </motion.p>
                </motion.div>
              </div>

              {/* Filters and Search */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", bounce: 0.2 }}
                className={`backdrop-blur-xl border rounded-3xl p-8 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 ${
                  isDark 
                    ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                    : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`} />
                    <input
                      id="course-search"
                      name="courseSearch"
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

                  {/* Filters and View Toggle */}
                  <div className="flex gap-3">
                    <select
                      id="status-filter"
                      name="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                        isDark 
                          ? 'bg-neutral-900 border-neutral-600 text-white' 
                          : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                      }`}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className={`flex rounded-lg border overflow-hidden ${
                      isDark ? 'border-neutral-600' : 'border-neutral-300'
                    }`}>
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`px-3 py-2.5 flex items-center gap-2 text-sm transition-all ${
                          viewMode === 'cards'
                            ? isDark 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-600 text-white'
                            : isDark 
                              ? 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800' 
                              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <FaTh className="w-3 h-3" />
                        Cards
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-2.5 flex items-center gap-2 text-sm transition-all ${
                          viewMode === 'table'
                            ? isDark 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-600 text-white'
                            : isDark 
                              ? 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800' 
                              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <FaTable className="w-3 h-3" />
                        Table
                      </button>
                    </div>

                    <button 
                      onClick={fetchCourses}
                      disabled={loading}
                      className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                        loading
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark 
                            ? 'bg-neutral-900 border-neutral-600 text-white hover:bg-neutral-800' 
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      {loading ? <FaSpinner className="w-3 h-3 animate-spin" /> : <FaFilter className="w-3 h-3" />}
                      {loading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Courses Display */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring", bounce: 0.2 }}
              >
                {viewMode === 'table' ? (
                  <div className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 ${
                    isDark 
                      ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                      : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`border-b ${
                          isDark ? 'border-neutral-700 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50'
                        }`}>
                          <tr>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Course
                            </th>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Educator
                            </th>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Submitted
                            </th>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Price
                            </th>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Status
                            </th>
                            <th className={`text-left p-4 font-medium text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                              <tr key={index} className={`border-b ${
                                isDark ? 'border-neutral-700' : 'border-neutral-200'
                              }`}>
                                {Array.from({ length: 6 }).map((_, colIndex) => (
                                  <td key={colIndex} className="p-4">
                                    <div className={`h-8 rounded animate-pulse ${
                                      isDark ? 'bg-neutral-700' : 'bg-neutral-200'
                                    }`}></div>
                                  </td>
                                ))}
                              </tr>
                            ))
                          ) : error ? (
                            <tr>
                              <td colSpan="6" className="p-8 text-center">
                                <div className="text-red-500 mb-2">Failed to load courses</div>
                                <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                  {error}
                                </div>
                                <button
                                  onClick={fetchCourses}
                                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Try Again
                                </button>
                              </td>
                            </tr>
                          ) : filteredCourses.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-8 text-center">
                                <div className={`text-lg mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                                  No courses found
                                </div>
                                <div className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                                  {searchTerm || statusFilter !== 'All' 
                                    ? 'Try adjusting your search or filters' 
                                    : 'No courses have been submitted yet'}
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredCourses.map((course, index) => (
                              <CourseRow 
                                key={course._id} 
                                course={course} 
                                index={index}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onView={handleView}
                                loading={actionLoading}
                              />
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className={`p-6 rounded-xl border animate-pulse ${
                          isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                        }`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-lg ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                            <div className="flex-1">
                              <div className={`h-6 rounded mb-2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                              <div className={`h-4 rounded w-3/4 mb-3 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                              <div className={`h-4 rounded w-1/2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : error ? (
                      <div className={`p-8 text-center rounded-xl border ${
                        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                      }`}>
                        <div className="text-red-500 mb-2">Failed to load courses</div>
                        <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {error}
                        </div>
                        <button
                          onClick={fetchCourses}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : filteredCourses.length === 0 ? (
                      <div className={`p-8 text-center rounded-xl border ${
                        isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                      }`}>
                        <div className={`text-lg mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          No courses found
                        </div>
                        <div className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          {searchTerm || statusFilter !== 'All' 
                            ? 'Try adjusting your search or filters' 
                            : 'No courses have been submitted yet'}
                        </div>
                      </div>
                    ) : (
                      filteredCourses.map((course, index) => (
                        <CourseCardExpanded 
                          key={course._id} 
                          course={course} 
                          index={index}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onView={handleView}
                          loading={actionLoading}
                        />
                      ))
                    )}
                  </div>
                )}
              </motion.div>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className={`mt-8 p-4 rounded-xl border flex items-center justify-between ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'
                }`}
              >
                <p className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all opacity-50 cursor-not-allowed ${
                      isDark 
                        ? 'bg-neutral-700 text-neutral-300' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white">
                    1
                  </button>
                  <button 
                    disabled
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all opacity-50 cursor-not-allowed ${
                      isDark 
                        ? 'bg-neutral-700 text-neutral-300' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </PageTransition>
    </AdminProtectedRoute>
  );
} 