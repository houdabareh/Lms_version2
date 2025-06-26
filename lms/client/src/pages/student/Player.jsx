import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlay, FiClock, FiUsers, FiStar, FiBookOpen, FiArrowRight, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CourseProgressBar from '../../components/student/CourseProgressBar';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  // Fetch course details from backend
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        console.log('🔍 Fetching course details for ID:', courseId);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/approved`, config);
        
        // Find the specific course
        const course = response.data.find(c => c._id === courseId);
        
        if (!course) {
          throw new Error('Course not found or not approved');
        }

        // Transform the data for display
        const transformedCourse = {
          id: course._id,
          title: course.title,
          description: course.description || 'Learn and master new skills with this comprehensive course.',
          instructor: course.educator?.name || 'Expert Instructor',
          instructorEmail: course.educator?.email || '',
          price: course.price || 0,
          thumbnailUrl: course.thumbnailUrl,
          videoPreviewUrl: course.videoPreviewUrl,
          rating: course.rating || 4.5,
          enrolledCount: course.enrolledCount || Math.floor(Math.random() * 1500) + 100,
          difficulty: course.difficulty || 'Intermediate',
          duration: course.duration || '12 weeks',
          curriculum: course.curriculum || [],
          status: course.status,
          canEnroll: course.canEnroll !== false
        };

        setCourseData(transformedCourse);

        // TODO: Check if user is already enrolled
        // This would require an enrollment check API endpoint
        setIsEnrolled(false);

      } catch (err) {
        console.error('❌ Error fetching course details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // Calculate total lessons and duration
  const getTotalLessons = () => {
    if (!courseData?.curriculum) return 0;
    return courseData.curriculum.reduce((total, section) => {
      return total + (section.lessons?.length || 0);
    }, 0);
  };

  const getTotalDuration = () => {
    if (!courseData?.curriculum) return '0h 0m';
    
    let totalMinutes = 0;
    courseData.curriculum.forEach(section => {
      section.lessons?.forEach(lesson => {
        if (lesson.duration) {
          // Parse duration string like "10:30" or "1h 30m"
          const durationStr = lesson.duration.toString();
          if (durationStr.includes(':')) {
            const [minutes, seconds] = durationStr.split(':').map(Number);
            totalMinutes += minutes + (seconds / 60);
          } else if (durationStr.includes('h') || durationStr.includes('m')) {
            const hours = durationStr.match(/(\d+)h/);
            const minutes = durationStr.match(/(\d+)m/);
            if (hours) totalMinutes += parseInt(hours[1]) * 60;
            if (minutes) totalMinutes += parseInt(minutes[1]);
          }
        }
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Handle enrollment
  const handleEnrollNow = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to enroll in courses');
        navigate('/login');
        return;
      }

      if (isEnrolled) {
        // If already enrolled, go to course player
        navigate(`/student/course-player/${courseId}`);
        return;
      }

      // Redirect to checkout page
      navigate(`/student/checkout/${courseId}`);
      
    } catch (error) {
      console.error('❌ Error handling enrollment:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-red-800 mb-3">Course Not Found</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/student/course-list')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Course Info */}
            <div className="lg:w-2/3 p-8">
              {/* Course Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseData.title}</h1>
              
              {/* Course Description */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">{courseData.description}</p>
              
              {/* Instructor Info */}
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-semibold text-gray-900">{courseData.instructor}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FiStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-semibold">{courseData.rating.toFixed(1)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="font-semibold">{courseData.enrolledCount.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FiBookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Lessons</p>
                  <p className="font-semibold">{getTotalLessons()}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FiClock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{getTotalDuration()}</p>
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  courseData.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  courseData.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {courseData.difficulty} Level
                </span>
              </div>
            </div>

            {/* Right: Video Preview & Enrollment */}
            <div className="lg:w-1/3 p-8 bg-gray-50">
              {/* Video Preview */}
              <div className="mb-6">
                {courseData.videoPreviewUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={courseData.thumbnailUrl}
                    >
                      <source src={courseData.videoPreviewUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : courseData.thumbnailUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                    <img 
                      src={courseData.thumbnailUrl} 
                      alt={courseData.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="bg-white rounded-full p-4">
                        <FiPlay className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FiPlay className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900">${courseData.price.toFixed(2)}</p>
                <p className="text-gray-500">One-time payment</p>
              </div>

              {/* Enrollment Button */}
              <button
                onClick={handleEnrollNow}
                disabled={enrollmentLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isEnrolled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                } ${enrollmentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {enrollmentLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isEnrolled ? (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <FiArrowRight className="w-5 h-5" />
                        Enroll Now
                      </>
                    )}
                  </>
                )}
              </button>

              {/* What's Included */}
              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {getTotalLessons()} comprehensive lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {getTotalDuration()} of video content
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        {courseData.curriculum && courseData.curriculum.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {courseData.curriculum.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500">
                      {section.lessons?.length || 0} lessons
                    </p>
                  </div>
                  {section.lessons && section.lessons.length > 0 && (
                    <div className="p-4">
                      <ul className="space-y-2">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <FiPlay className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{lesson.title}</span>
                            </div>
                            {lesson.duration && (
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;