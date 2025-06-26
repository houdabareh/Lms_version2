import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronRight, FiPlay, FiClock, FiFileText, FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import CourseProgressBar from '../../components/student/CourseProgressBar';
import { FaExclamationTriangle } from 'react-icons/fa';

const CoursePlayer = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const location = window.location;
  const isLessonRoute = location.pathname.includes('/lesson/');
  const navigate = useNavigate();
  
  // State for dynamic course data
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Existing state
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('transcript'); // transcript, notes
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentTranscriptLine, setCurrentTranscriptLine] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([1, 2]); // Mock completed lessons
  
  // Mock task data - which lessons have associated tasks
  const [lessonTasks] = useState({
    1: { id: 1, title: 'Build Your First React Component' }, // Lesson 1 has Task 1
    3: { id: 3, title: 'Create JSX Elements' }, // Lesson 3 has Task 3
    5: { id: 5, title: 'Props and Data Flow Exercise' }, // Lesson 5 has Task 5
    6: { id: 6, title: 'State Management Practice' } // Lesson 6 has Task 6
  });

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to access courses');
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        console.log('🔍 Fetching course data for player:', courseId);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/approved`, config);
        
        // Find the specific course
        const course = response.data.find(c => c._id === courseId);
        
        if (!course) {
          throw new Error('Course not found or not approved');
        }

        // Transform course data to match the existing UI structure
        const transformedCourse = {
          id: course._id,
          title: course.title,
          instructor: course.educator?.name || 'Course Instructor',
          modules: course.curriculum?.map((section, sectionIndex) => ({
            id: sectionIndex + 1,
            title: section.title,
            duration: `${section.lessons?.length || 0} lessons`,
            lessons: section.lessons?.map((lesson, lessonIndex) => {
              // Calculate unique lesson ID across all sections
              const globalLessonId = (sectionIndex * 100) + lessonIndex + 1;
              
              return {
                id: globalLessonId,
                title: lesson.title,
                duration: lesson.duration || '5:00',
                videoUrl: lesson.videoUrl || lesson.videoFile || 'https://www.youtube.com/embed/Ke90Tje7VS0',
                transcript: lesson.summary ? [
                  {
                    id: 1,
                    startTime: '00:00',
                    endTime: '05:00',
                    speaker: course.educator?.name || 'Instructor',
                    text: lesson.summary,
                    translation: lesson.summary // Using same text for translation demo
                  }
                ] : [],
                notes: lesson.summary ? `Lesson Notes:
${lesson.summary}

Key Questions:
${lesson.questions?.map((q, idx) => `${idx + 1}. ${q}`).join('\n') || 'No questions available'}

Additional Resources:
- Course materials
- Supplementary readings
- Practice exercises` : 'No notes available for this lesson.'
              };
            }) || []
          })) || []
        };

        setCourseData(transformedCourse);
        
        // Set first lesson as current if none is specified
        if (!currentLesson && transformedCourse.modules.length > 0 && transformedCourse.modules[0].lessons.length > 0) {
          setCurrentLesson(transformedCourse.modules[0].lessons[0]);
        }

        // Expand first module by default
        if (transformedCourse.modules.length > 0) {
          setExpandedModules({ 1: true });
        }

      } catch (err) {
        console.error('❌ Error fetching course data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course data');
        toast.error('Failed to load course. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, navigate]);

  // Update current lesson when lessonId changes
  useEffect(() => {
    if (courseData && lessonId) {
      const lesson = findLessonById(parseInt(lessonId));
      if (lesson) {
        setCurrentLesson(lesson);
      }
    }
  }, [lessonId, courseData]);

  // Helper function to find lesson by ID
  const findLessonById = (id) => {
    if (!courseData?.modules) return null;
    
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
    return null;
  };

  // Helper function to convert time string to seconds
  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Helper function to format seconds to MM:SS
  const secondsToTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate video time progression (in a real app, this would come from video player)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update current transcript line based on video time
  useEffect(() => {
    if (currentLesson?.transcript && Array.isArray(currentLesson.transcript)) {
      const currentTime = secondsToTime(currentVideoTime);
      const currentLineIndex = currentLesson.transcript.findIndex(line => {
        const startSeconds = timeToSeconds(line.startTime);
        const endSeconds = timeToSeconds(line.endTime);
        const currentSeconds = currentVideoTime;
        return currentSeconds >= startSeconds && currentSeconds <= endSeconds;
      });
      
      if (currentLineIndex !== -1) {
        setCurrentTranscriptLine(currentLineIndex);
      }
    }
  }, [currentVideoTime, currentLesson]);

  // Calculate course progress data
  const getTotalLessons = () => {
    if (!courseData || !courseData.modules) return 0;
    return courseData.modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const getCurrentLessonNumber = () => {
    if (!currentLesson || !courseData || !courseData.modules) return 1;
    let lessonCount = 0;
    for (const module of courseData.modules) {
      for (const lesson of module.lessons) {
        lessonCount++;
        if (lesson.id === currentLesson.id) {
          return lessonCount;
        }
      }
    }
    return 1;
  };

  const getEstimatedTimeRemaining = () => {
    // Mock calculation - in real app, this would be based on actual lesson durations
    const totalLessons = getTotalLessons();
    const currentLessonNum = getCurrentLessonNumber();
    const remainingLessons = totalLessons - currentLessonNum;
    const avgLessonTime = 15; // minutes
    const totalMinutes = remainingLessons * avgLessonTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Find current lesson based on URL params
  useEffect(() => {
    // Only run if courseData is loaded
    if (!courseData || !courseData.modules || courseData.modules.length === 0) {
      return;
    }

    if (isLessonRoute && lessonId) {
      // Handle /course/:courseId/lesson/:lessonId route
      const targetLessonId = parseInt(lessonId);
      let foundLesson = null;
      let foundModuleId = null;
      
      // Find lesson across all modules
      for (const module of courseData.modules) {
        const lesson = module.lessons.find(l => l.id === targetLessonId);
        if (lesson) {
          foundLesson = lesson;
          foundModuleId = module.id;
          break;
        }
      }
      
      if (foundLesson) {
        setCurrentLesson(foundLesson);
        setExpandedModules(prev => ({ ...prev, [foundModuleId]: true }));
      }
    } else if (moduleId && lessonId) {
      // Handle /course-player/:courseId/:moduleId/:lessonId route
      const module = courseData.modules.find(m => m.id === parseInt(moduleId));
      if (module) {
        const lesson = module.lessons.find(l => l.id === parseInt(lessonId));
        if (lesson) {
          setCurrentLesson(lesson);
          setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
        }
      }
    } else {
      // Default to first lesson
      const firstModule = courseData.modules[0];
      const firstLesson = firstModule.lessons[0];
      setCurrentLesson(firstLesson);
      setExpandedModules({ [firstModule.id]: true });
      
      // Navigate based on current route pattern
      if (isLessonRoute) {
        navigate(`/course/${courseId}/lesson/${firstLesson.id}`, { replace: true });
      } else {
        navigate(`/course-player/${courseId}/${firstModule.id}/${firstLesson.id}`, { replace: true });
      }
    }
  }, [courseData, courseId, moduleId, lessonId, navigate, isLessonRoute]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectLesson = (moduleId, lessonId) => {
    navigate(`/student/course-player/${courseId}/${moduleId}/${lessonId}`);
  };

  const getNextLesson = () => {
    if (!courseData || !courseData.modules) return null;
    
    const currentModuleIndex = courseData.modules.findIndex(m => 
      m.lessons.some(l => l.id === currentLesson?.id)
    );
    const currentModule = courseData.modules[currentModuleIndex];
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson?.id);
    
    // Next lesson in same module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      const nextLesson = currentModule.lessons[currentLessonIndex + 1];
      return {
        moduleId: currentModule.id,
        lesson: nextLesson,
        lessonNumber: getLessonNumber(nextLesson.id),
        hasTask: lessonTasks.hasOwnProperty(nextLesson.id),
        task: lessonTasks[nextLesson.id] || null
      };
    }
    
    // First lesson of next module
    if (currentModuleIndex < courseData.modules.length - 1) {
      const nextModule = courseData.modules[currentModuleIndex + 1];
      const nextLesson = nextModule.lessons[0];
      return {
        moduleId: nextModule.id,
        lesson: nextLesson,
        lessonNumber: getLessonNumber(nextLesson.id),
        hasTask: lessonTasks.hasOwnProperty(nextLesson.id),
        task: lessonTasks[nextLesson.id] || null
      };
    }
    
    return null;
  };

  // Helper function to get lesson number in sequence
  const getLessonNumber = (lessonId) => {
    if (!courseData || !courseData.modules) return 1;
    
    let lessonCount = 0;
    for (const module of courseData.modules) {
      for (const lesson of module.lessons) {
        lessonCount++;
        if (lesson.id === lessonId) {
          return lessonCount;
        }
      }
    }
    return lessonCount;
  };

  const goToNextLesson = () => {
    // Mark current lesson as completed
    const currentLessonNum = getCurrentLessonNumber();
    if (!completedLessons.includes(currentLessonNum)) {
      setCompletedLessons(prev => [...prev, currentLessonNum]);
    }
    
    // Get next lesson information
    const nextLessonInfo = getNextLesson();
    
    if (!nextLessonInfo) {
      // No next lesson - course complete
      console.log('Course completed!');
      return;
    }
    
    // Check if next lesson has a task
    if (nextLessonInfo.hasTask) {
      console.log(`Next lesson has a task: ${nextLessonInfo.task.title}`);
      // Navigate to task page for the next lesson
      navigate(`/course/${courseId}/task/${nextLessonInfo.task.id}`);
    } else {
      console.log(`Next lesson has no task, going directly to lesson ${nextLessonInfo.lesson.id}`);
      // Navigate directly to next lesson
      navigate(`/course/${courseId}/lesson/${nextLessonInfo.lesson.id}`);
    }
  };

  // Check if current lesson has a task
  const currentLessonHasTask = () => {
    return currentLesson && lessonTasks.hasOwnProperty(currentLesson.id);
  };

  // Get current lesson's task if it exists
  const getCurrentLessonTask = () => {
    return currentLesson ? lessonTasks[currentLesson.id] : null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Course
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Course data not available
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Course not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Current lesson loading
  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Progress Bar */}
      <CourseProgressBar
        currentLesson={getCurrentLessonNumber()}
        totalLessons={getTotalLessons()}
        courseTitle={courseData.title}
        completedLessons={completedLessons}
        estimatedTimeRemaining={getEstimatedTimeRemaining()}
      />

      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

      {/* Left Sidebar - Course Navigation */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
          <p className="text-sm text-gray-600">by {courseData.instructor}</p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {courseData.modules.map((module) => (
            <div key={module.id} className="border-b">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FiClock className="mr-1" size={14} />
                    {module.duration}
                  </p>
                </div>
                {expandedModules[module.id] ? 
                  <FiChevronDown className="text-gray-500" /> : 
                  <FiChevronRight className="text-gray-500" />
                }
              </button>

              {expandedModules[module.id] && (
                <div className="bg-gray-50">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(module.id, lesson.id)}
                      className={`w-full px-8 py-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${
                        currentLesson?.id === lesson.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-transparent text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <FiPlay size={14} className="mr-3 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="max-w-6xl mx-auto p-6">
          {/* Video Player Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
              <p className="text-gray-600 flex items-center">
                <FiClock className="mr-2" size={16} />
                {currentLesson.duration}
              </p>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transcript'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiFileText className="inline mr-2" size={16} />
                  Transcript
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'notes'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiFileText className="inline mr-2" size={16} />
                  Notes & Resources
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'transcript' ? (
                <div className="max-w-none">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Lesson Transcript</h3>
                    
                    {/* Enhanced Language Toggle Switch */}
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-full p-1">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-200 ${!showTranslation ? 'text-white bg-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                        EN
                      </span>
                      <button
                        onClick={() => setShowTranslation(!showTranslation)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-inner ${
                          showTranslation ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
                            showTranslation ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full transition-all duration-200 ${showTranslation ? 'text-white bg-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                        FR
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Transcript Container with Fixed Height */}
                  <div className="max-h-[350px] overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm">
                    {Array.isArray(currentLesson.transcript) ? (
                      <div className="p-1">
                        {currentLesson.transcript.map((line, index) => (
                          <div
                            key={line.id}
                            className={`group relative flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
                              index === currentTranscriptLine
                                ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                                : 'border-l-4 border-transparent'
                            }`}
                            onClick={() => {
                              // Placeholder handler for timestamp click
                              console.log(`Seeking to ${line.startTime} - ${line.text.substring(0, 50)}...`);
                              alert(`Would seek video to ${line.startTime}`);
                            }}
                          >
                            {/* Currently Playing Blue Dot */}
                            {index === currentTranscriptLine && (
                              <div className="absolute -left-1 top-6">
                                <div className="relative">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                                </div>
                              </div>
                            )}

                            {/* Timestamp - Clickable */}
                            <div className="flex-shrink-0 w-16">
                              <button 
                                className={`text-xs font-mono font-medium px-2 py-1 rounded transition-all duration-200 hover:bg-blue-100 ${
                                  index === currentTranscriptLine 
                                    ? 'text-blue-700 bg-blue-100' 
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Timestamp clicked: ${line.startTime}`);
                                  alert(`Would seek video to ${line.startTime}`);
                                }}
                              >
                                {line.startTime}
                              </button>
                            </div>

                            {/* Speaker Avatar & Name */}
                            <div className="flex-shrink-0">
                              <div className="flex flex-col items-center space-y-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm transition-all duration-200 ${
                                  line.speaker === 'John Smith' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                } ${index === currentTranscriptLine ? 'ring-2 ring-blue-300 scale-105' : 'group-hover:scale-105'}`}>
                                  {line.speaker.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className={`text-xs font-medium text-center leading-tight ${
                                  index === currentTranscriptLine ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                  {line.speaker.split(' ')[0]}
                                </div>
                              </div>
                            </div>

                            {/* Transcript Content with Smooth Language Transition */}
                            <div className="flex-1 min-w-0">
                              <div className="relative overflow-hidden">
                                {/* English Text */}
                                <div className={`transition-all duration-500 ease-in-out ${
                                  !showTranslation 
                                    ? 'opacity-100 transform translate-y-0' 
                                    : 'opacity-0 transform -translate-y-2 absolute inset-0'
                                }`}>
                                  <p className={`text-sm leading-relaxed ${
                                    index === currentTranscriptLine 
                                      ? 'text-gray-900 font-medium' 
                                      : 'text-gray-700'
                                  }`}>
                                    {line.text}
                                  </p>
                                </div>
                                
                                {/* French Translation */}
                                <div className={`transition-all duration-500 ease-in-out ${
                                  showTranslation 
                                    ? 'opacity-100 transform translate-y-0' 
                                    : 'opacity-0 transform translate-y-2 absolute inset-0'
                                }`}>
                                  <p className={`text-sm leading-relaxed italic ${
                                    index === currentTranscriptLine 
                                      ? 'text-gray-900 font-medium' 
                                      : 'text-gray-700'
                                  }`}>
                                    {line.translation}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Enhanced Current Playing Indicator */}
                              {index === currentTranscriptLine && (
                                <div className="flex items-center mt-3 text-xs">
                                  <div className="flex items-center space-x-2 px-2 py-1 bg-blue-100 rounded-full">
                                    <div className="relative">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                      <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <span className="text-blue-700 font-medium">Currently playing</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* End Time */}
                            <div className="flex-shrink-0 w-16 text-right">
                              <span className={`text-xs font-mono ${
                                index === currentTranscriptLine ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {line.endTime}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Fallback for simple text transcript
                      <div className="p-6">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {currentLesson.transcript}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Status Bar */}
                  <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        <span className="font-medium">Video Time:</span> {secondsToTime(currentVideoTime)}
                      </span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-600">
                        <span className="font-medium">Line:</span> {currentTranscriptLine + 1} of {currentLesson.transcript?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${showTranslation ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {showTranslation ? 'Français' : 'English'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">Lesson Notes & Resources</h3>
                  <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {currentLesson.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Navigation Debug Info:</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>Current Lesson: {currentLesson?.title} (ID: {currentLesson?.id})</div>
              <div>Has Task: {currentLessonHasTask() ? '✅ Yes' : '❌ No'}</div>
              {currentLessonHasTask() && (
                <div>Task: {getCurrentLessonTask()?.title}</div>
              )}
              <div>Next Action: {(() => {
                const nextInfo = getNextLesson();
                if (!nextInfo) return 'Course Complete';
                return nextInfo.hasTask ? `Task: ${nextInfo.task.title}` : `Lesson: ${nextInfo.lesson.title}`;
              })()}</div>
              <div>Route Type: {isLessonRoute ? 'Lesson Route' : 'Player Route'}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Lesson {currentLesson.id} of {courseData.modules.reduce((total, module) => total + module.lessons.length, 0)}
            </div>
            
            <button
              onClick={goToNextLesson}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>
                {(() => {
                  const nextLessonInfo = getNextLesson();
                  if (!nextLessonInfo) return 'Course Complete!';
                  if (nextLessonInfo.hasTask) return 'Next: Start Task';
                  return 'Next Lesson';
                })()}
              </span>
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CoursePlayer;