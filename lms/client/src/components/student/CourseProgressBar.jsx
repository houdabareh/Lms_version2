import React from 'react';
import { FiPlay, FiCheck, FiClock } from 'react-icons/fi';

const CourseProgressBar = ({ 
  currentLesson = 1, 
  totalLessons = 10, 
  courseTitle = "Course Title",
  completedLessons = [],
  estimatedTimeRemaining = "2h 30m"
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentLesson / totalLessons) * 100;
  const completionPercentage = (completedLessons.length / totalLessons) * 100;

  // Progress bar segments for visual representation
  const segments = Array.from({ length: totalLessons }, (_, index) => {
    const lessonNumber = index + 1;
    const isCompleted = completedLessons.includes(lessonNumber);
    const isCurrent = lessonNumber === currentLesson;
    const isUpcoming = lessonNumber > currentLesson;

    return {
      id: lessonNumber,
      isCompleted,
      isCurrent,
      isUpcoming
    };
  });

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Progress Section */}
        <div className="py-4 sm:py-6">
          {/* Course Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {courseTitle}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <FiPlay className="mr-1" size={14} />
                  Lesson {currentLesson} of {totalLessons}
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1" size={14} />
                  {estimatedTimeRemaining} remaining
                </span>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{Math.round(progressPercentage)}%</div>
                <div className="text-gray-500">Progress</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{completedLessons.length}</div>
                <div className="text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-3">
            {/* Main Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                {/* Background Progress (Overall Progress) */}
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
                
                {/* Completion Progress (Green overlay for completed lessons) */}
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              {/* Current Lesson Indicator */}
              <div 
                className="absolute top-0 h-3 w-1 bg-white border-2 border-blue-600 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-500 ease-out"
                style={{ left: `${progressPercentage}%` }}
              >
                {/* Pulsing dot */}
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse opacity-75"></div>
              </div>
            </div>

            {/* Lesson Segments (Desktop only) */}
            <div className="hidden lg:flex justify-between items-center">
              {segments.map((segment) => (
                <div 
                  key={segment.id}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    segment.isCurrent ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {/* Lesson Circle */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    segment.isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : segment.isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {segment.isCompleted ? (
                      <FiCheck size={14} />
                    ) : (
                      segment.id
                    )}
                  </div>
                  
                  {/* Lesson Label */}
                  <div className={`text-xs mt-1 transition-colors duration-300 ${
                    segment.isCurrent
                      ? 'text-blue-600 font-medium'
                      : segment.isCompleted
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    L{segment.id}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Progress Dots */}
            <div className="flex lg:hidden justify-center space-x-2 mt-2">
              {segments.slice(0, 8).map((segment) => (
                <div
                  key={segment.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    segment.isCompleted
                      ? 'bg-green-500'
                      : segment.isCurrent
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
              {totalLessons > 8 && (
                <span className="text-xs text-gray-500 ml-2">+{totalLessons - 8}</span>
              )}
            </div>
          </div>

          {/* Achievement Banner (when milestone reached) */}
          {completedLessons.length > 0 && completedLessons.length % 3 === 0 && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="text-white" size={14} />
                </div>
                <span className="text-green-800 font-medium">
                  Great progress! You've completed {completedLessons.length} lessons!
                </span>
                <div className="text-xl">🎉</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressBar; 