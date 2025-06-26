import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaUser, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaPlay, 
  FaFileAlt, 
  FaClock, 
  FaBookOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaMagic
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useTheme } from '../../context/ThemeContext';
import { getDownloadableUrl } from '../../utils/supabaseUtils';

const StatusBadge = ({ status }) => {
  const { isDark } = useTheme();
  
  const statusStyles = {
    'pending': isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'approved': isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
    'rejected': isDark ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`px-4 py-2 text-sm font-medium rounded-full border ${statusStyles[status] || statusStyles.pending}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </span>
  );
};

const LessonCard = ({ lesson, lessonIndex, isDark }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: lessonIndex * 0.1 }}
      className={`p-6 rounded-xl border ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      } hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {lesson.title || 'Untitled Lesson'}
          </h4>
          {(lesson.summary || (lesson.questions && lesson.questions.length > 0)) && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isDark 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              <FaMagic className="w-3 h-3" />
              AI
            </div>
          )}
        </div>
        {lesson.duration && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isDark 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            <FaClock className="w-3 h-3" />
            {lesson.duration}
          </div>
        )}
      </div>

      {/* Video Preview */}
      {lesson.videoUrl && (
        <div className="mb-4">
          <h5 className={`text-sm font-medium mb-2 flex items-center gap-2 ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            <FaPlay className="w-3 h-3" />
            Video Content
          </h5>
          {!videoError ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                controls
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
                preload="metadata"
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className={`aspect-video rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDark 
                ? 'border-neutral-600 bg-neutral-700' 
                : 'border-neutral-300 bg-neutral-50'
            }`}>
              <div className="text-center">
                <FaExclamationTriangle className={`w-8 h-8 mx-auto mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`} />
                <p className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Unable to load video
                </p>
                <a 
                  href={lesson.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm underline"
                >
                  View in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Summary */}
      {lesson.summary && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          isDark 
            ? 'bg-purple-900/20 border-purple-500/50 text-purple-300' 
            : 'bg-purple-50 border-purple-400 text-purple-800'
        }`}>
          <h5 className={`text-sm font-semibold mb-2 ${
            isDark ? 'text-purple-300' : 'text-purple-700'
          }`}>
            AI Summary:
          </h5>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-purple-200' : 'text-purple-800'
          }`}>
            {lesson.summary}
          </p>
        </div>
      )}

      {/* Assessment Questions */}
      {lesson.questions && lesson.questions.length > 0 && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          isDark 
            ? 'bg-blue-900/20 border-blue-500/50' 
            : 'bg-blue-50 border-blue-400'
        }`}>
          <h5 className={`text-sm font-semibold mb-2 ${
            isDark ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Assessment Questions:
          </h5>
          <ul className={`list-decimal list-inside space-y-1 text-sm ${
            isDark ? 'text-blue-200' : 'text-blue-800'
          }`}>
            {lesson.questions.map((question, qIndex) => (
              <li key={qIndex} className="leading-relaxed">
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Material File */}
      {lesson.materialUrl && (
        <div className="mb-4">
          <h5 className={`text-sm font-medium mb-2 flex items-center gap-2 ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            <FaFileAlt className="w-3 h-3" />
            Course Material
          </h5>
          <div className="flex gap-2">
            <a
              href={getDownloadableUrl(lesson.materialUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-green-600 text-green-300 hover:bg-green-600/20 bg-green-500/10' 
                  : 'border-green-300 text-green-700 hover:bg-green-50 bg-green-50/50'
              }`}
            >
              <FaFileAlt className="w-4 h-4" />
              Download
            </a>
            <a
              href={lesson.materialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-blue-600 text-blue-300 hover:bg-blue-600/20 bg-blue-500/10' 
                  : 'border-blue-300 text-blue-700 hover:bg-blue-50 bg-blue-50/50'
              }`}
            >
              <FaPlay className="w-4 h-4" />
              Preview
            </a>
          </div>
        </div>
      )}

      {!lesson.videoUrl && !lesson.materialUrl && !lesson.summary && (!lesson.questions || lesson.questions.length === 0) && (
        <p className={`text-sm italic ${
          isDark ? 'text-neutral-500' : 'text-neutral-500'
        }`}>
          No content available for this lesson
        </p>
      )}
    </motion.div>
  );
};

const SectionCard = ({ section, sectionIndex, isDark }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: sectionIndex * 0.2 }}
      className={`rounded-xl border overflow-hidden ${
        isDark 
          ? 'bg-neutral-800/50 border-neutral-700' 
          : 'bg-white border-neutral-200'
      } shadow-lg`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-6 text-left flex items-center justify-between transition-colors ${
          isDark 
            ? 'hover:bg-neutral-700/50' 
            : 'hover:bg-neutral-50'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
            isDark ? 'bg-blue-600' : 'bg-blue-500'
          }`}>
            {sectionIndex + 1}
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {section.title || `Section ${sectionIndex + 1}`}
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              {section.lessons?.length || 0} lesson{section.lessons?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaArrowLeft className={`w-5 h-5 transform rotate-90 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 space-y-4">
          {section.lessons && section.lessons.length > 0 ? (
            section.lessons.map((lesson, lessonIndex) => (
              <LessonCard
                key={lessonIndex}
                lesson={lesson}
                lessonIndex={lessonIndex}
                isDark={isDark}
              />
            ))
          ) : (
            <p className={`text-center py-8 ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              No lessons in this section
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CourseDetailsAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { apiCall } = useAdminAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiCall(`/api/admin/courses/${id}`);
        const courseData = response.data || response;
        
        // Debug logging for AI content
        console.log('🔍 Frontend Debug: Course data received');
        console.log('Course ID:', id);
        console.log('Course Title:', courseData.title);
        console.log('Curriculum sections:', courseData.curriculum?.length || 0);
        
        courseData.curriculum?.forEach((section, sIndex) => {
          console.log(`\n📖 Section ${sIndex + 1}: ${section.title}`);
          console.log(`   Lessons: ${section.lessons?.length || 0}`);
          
          section.lessons?.forEach((lesson, lIndex) => {
            console.log(`\n   📝 Lesson ${lIndex + 1}: ${lesson.title}`);
            console.log(`      Summary: ${lesson.summary ? 'YES (' + lesson.summary.substring(0, 50) + '...)' : 'NO'}`);
            console.log(`      Questions: ${lesson.questions && lesson.questions.length > 0 ? 'YES (' + lesson.questions.length + ')' : 'NO'}`);
            console.log(`      VideoUrl: ${lesson.videoUrl ? 'YES' : 'NO'}`);
            console.log(`      MaterialUrl: ${lesson.materialUrl ? 'YES' : 'NO'}`);
            
            if (lesson.summary) {
              console.log(`      Summary content: ${lesson.summary}`);
            }
            
            if (lesson.questions && lesson.questions.length > 0) {
              lesson.questions.forEach((q, qIndex) => {
                console.log(`        Q${qIndex + 1}: ${q}`);
              });
            }
          });
        });
        
        setCourse(courseData);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError(err.message);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, apiCall]);

  // Handle course approval
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await apiCall(`/api/admin/courses/${id}/approve`, {
        method: 'PUT'
      });
      
      toast.success('Course approved successfully!');
      setCourse(prev => prev ? { ...prev, status: 'approved' } : null);
    } catch (err) {
      console.error('Failed to approve course:', err);
      toast.error('Failed to approve course');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle course rejection
  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || !reason.trim()) return;

    try {
      setActionLoading(true);
      await apiCall(`/api/admin/courses/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason: reason.trim() })
      });
      
      toast.success('Course rejected successfully!');
      setCourse(prev => prev ? { ...prev, status: 'rejected', rejectionReason: reason.trim() } : null);
    } catch (err) {
      console.error('Failed to reject course:', err);
      toast.error('Failed to reject course');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <PageTransition pageName="Course Details">
          <div className={`min-h-screen flex transition-colors duration-300 ${
            isDark ? 'bg-neutral-900' : 'bg-neutral-50'
          }`}>
            <AdminSidebar active="Courses" />
            <div className="flex-1 ml-72">
              <AdminNavbar />
              <main className="p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <FaSpinner className={`w-12 h-12 mx-auto mb-4 animate-spin ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <p className={`text-lg ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      Loading course details...
                    </p>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </PageTransition>
      </AdminProtectedRoute>
    );
  }

  if (error || !course) {
    return (
      <AdminProtectedRoute>
        <PageTransition pageName="Course Details">
          <div className={`min-h-screen flex transition-colors duration-300 ${
            isDark ? 'bg-neutral-900' : 'bg-neutral-50'
          }`}>
            <AdminSidebar active="Courses" />
            <div className="flex-1 ml-72">
              <AdminNavbar />
              <main className="p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <FaExclamationTriangle className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? 'text-red-400' : 'text-red-600'
                    }`} />
                    <p className={`text-lg mb-4 ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      {error || 'Course not found'}
                    </p>
                    <button
                      onClick={() => navigate('/admin/pending-courses')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Back to Courses
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </PageTransition>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <PageTransition pageName="Course Details">
        <div className={`min-h-screen flex transition-colors duration-300 ${
          isDark ? 'bg-neutral-900' : 'bg-neutral-50'
        }`}>
          <AdminSidebar active="Courses" />
          
          <div className="flex-1 ml-72">
            <AdminNavbar />
            
            <main className="p-8">
              {/* Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate('/admin/pending-courses')}
                      className={`p-3 rounded-xl transition-colors ${
                        isDark 
                          ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                          : 'bg-white text-neutral-700 hover:bg-neutral-50'
                      } border border-neutral-300 dark:border-neutral-700`}
                    >
                      <FaArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h1 className={`text-3xl font-bold ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        Course Review
                      </h1>
                      <p className={`text-lg ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        Detailed course submission review
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {course.status === 'pending' && (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleApprove}
                        disabled={actionLoading}
                        whileHover={{ scale: actionLoading ? 1 : 1.05 }}
                        whileTap={{ scale: actionLoading ? 1 : 0.95 }}
                        className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
                          actionLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25'
                        }`}
                      >
                        <FaCheck className="w-4 h-4" />
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </motion.button>

                      <motion.button
                        onClick={handleReject}
                        disabled={actionLoading}
                        whileHover={{ scale: actionLoading ? 1 : 1.05 }}
                        whileTap={{ scale: actionLoading ? 1 : 0.95 }}
                        className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
                          actionLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
                        }`}
                      >
                        <FaTimes className="w-4 h-4" />
                        {actionLoading ? 'Processing...' : 'Reject'}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Course Overview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl border p-8 mb-8 ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700' 
                    : 'bg-white border-neutral-200'
                } shadow-lg`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Course Thumbnail */}
                  <div className="lg:col-span-1">
                    <div className="aspect-video rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaBookOpen className={`w-12 h-12 ${
                            isDark ? 'text-neutral-500' : 'text-neutral-400'
                          }`} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className={`text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {course.title}
                        </h2>
                        <StatusBadge status={course.status} />
                      </div>
                      
                      <p className={`text-lg leading-relaxed ${
                        isDark ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        {course.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Educator Info */}
                      <div className={`p-4 rounded-lg ${
                        isDark ? 'bg-neutral-700' : 'bg-neutral-50'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <FaUser className={`w-4 h-4 ${
                            isDark ? 'text-neutral-400' : 'text-neutral-600'
                          }`} />
                          <span className={`font-medium ${
                            isDark ? 'text-neutral-300' : 'text-neutral-700'
                          }`}>
                            Educator
                          </span>
                        </div>
                        <p className={`font-semibold ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {course.educator?.name || 'Unknown Educator'}
                        </p>
                        <p className={`text-sm ${
                          isDark ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          {course.educator?.email}
                        </p>
                      </div>

                      {/* Course Details */}
                      <div className={`p-4 rounded-lg ${
                        isDark ? 'bg-neutral-700' : 'bg-neutral-50'
                      }`}>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaDollarSign className={`w-4 h-4 ${
                                isDark ? 'text-neutral-400' : 'text-neutral-600'
                              }`} />
                              <span className={`text-sm ${
                                isDark ? 'text-neutral-300' : 'text-neutral-700'
                              }`}>
                                Price
                              </span>
                            </div>
                            <span className={`font-bold text-lg ${
                              isDark ? 'text-green-400' : 'text-green-600'
                            }`}>
                              ${course.price || '0'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className={`w-4 h-4 ${
                                isDark ? 'text-neutral-400' : 'text-neutral-600'
                              }`} />
                              <span className={`text-sm ${
                                isDark ? 'text-neutral-300' : 'text-neutral-700'
                              }`}>
                                Submitted
                              </span>
                            </div>
                            <span className={`text-sm ${
                              isDark ? 'text-neutral-300' : 'text-neutral-700'
                            }`}>
                              {new Date(course.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Course Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Course Curriculum
                </h2>

                {course.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-6">
                    {course.curriculum.map((section, sectionIndex) => (
                      <SectionCard
                        key={sectionIndex}
                        section={section}
                        sectionIndex={sectionIndex}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 rounded-xl border ${
                    isDark 
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-400' 
                      : 'bg-white border-neutral-200 text-neutral-600'
                  }`}>
                    <FaBookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No curriculum content available</p>
                  </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </PageTransition>
    </AdminProtectedRoute>
  );
} 