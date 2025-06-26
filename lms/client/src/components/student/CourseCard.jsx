import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Rating from './Rating'
// import { assets } from '../../assets/assets'
// import { Link } from 'react-router-dom'

const CourseCard = ({ course, showStatus, isClickable = true, onClick }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  // Provide robust default course data for safe rendering
  const defaultCourse = {
    id: 'placeholder',
    image: '/assets/course_1.png',
    title: 'Default Course Title',
    instructor: 'Default Instructor',
    description: 'Course description not available.',
    price: 0.00,
    rating: 0.0,
    difficulty: 'Beginner',
    enrolled: 0,
    duration: '0h 0m'
  };

  // Ensure course is always an object, using defaultCourse if 'course' prop is null/undefined
  const courseToDisplay = course || defaultCourse;

  // Safely access properties, providing fallbacks if nested properties are missing
  const imageUrl = !imageError && courseToDisplay.image ? courseToDisplay.image : '/assets/course_1.png';
  const courseTitle = courseToDisplay.title || 'Course Title Not Provided';
  const courseInstructor = courseToDisplay.instructor || 'Instructor Not Provided';
  const courseDescription = courseToDisplay.description || 'No description available.';
  const coursePrice = typeof courseToDisplay.price === 'number' ? courseToDisplay.price.toFixed(2) : '0.00';
  const courseRating = typeof courseToDisplay.rating === 'number' ? courseToDisplay.rating : 0.0;
  const courseDifficulty = courseToDisplay.difficulty || courseToDisplay.level || 'Beginner';
  const enrolledLearners = courseToDisplay.enrolled || courseToDisplay.enrolledCount || 0;
  const courseDuration = courseToDisplay.duration || 'N/A';
  const courseStatus = courseToDisplay.status || 'Approved';

  // Truncate description to max 120 characters
  const truncatedDescription = courseDescription.length > 120 
    ? courseDescription.substring(0, 120).trim() + '...'
    : courseDescription;

  // Get difficulty badge colors
  const getDifficultyStyles = (difficulty) => {
    const level = difficulty.toLowerCase();
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Handle course card click
  const handleCardClick = () => {
    if (isClickable) {
      if (onClick) {
        onClick(courseToDisplay.id);
      } else {
        navigate(`/student/courses/${courseToDisplay.id}`);
      }
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 border border-gray-200 relative group ${
        isClickable ? 'hover:scale-105 hover:shadow-xl cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Course Difficulty Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyStyles(courseDifficulty)}`}>
          {courseDifficulty}
        </span>
      </div>

      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={courseTitle}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Course Title */}
        <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 leading-tight">
          {courseTitle}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-3 line-height-relaxed">
          {truncatedDescription}
        </p>

        {/* Instructor */}
        <p className="text-gray-700 text-sm mb-3 font-medium">
          By {courseInstructor}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Rating rating={courseRating} />
          <span className="text-gray-500 text-sm ml-2">({courseRating.toFixed(1)})</span>
        </div>

        {/* Course Stats */}
        <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{enrolledLearners.toLocaleString()} enrolled</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span>{courseDuration}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-blue-600 font-bold text-xl">
            ${coursePrice}
          </p>
          
          {/* Status Badge (for educator view) */}
          {showStatus && (
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              courseStatus === 'Approved' ? 'bg-green-100 text-green-800' :
              courseStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              courseStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {typeof courseStatus === 'string' ? courseStatus : 'Unknown'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard