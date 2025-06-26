import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';

const CoursesList = () => {
  const { input } = useParams(); // Get input from URL parameter
  const navigate = useNavigate();

  // State management
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(input || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'enrolled', 'price-low', 'price-high'

  // Fetch approved courses from API
  useEffect(() => {
    const fetchApprovedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        console.log('🔍 Fetching approved courses from API...');
        const response = await axios.get('http://localhost:5000/api/courses/approved', config);
        
        console.log('✅ API Response:', response.data);
        
        // Transform API data to match CourseCard component expectations
        const transformedCourses = response.data.map(course => ({
          id: course._id,
          title: course.title,
          description: course.description || 'Learn and master new skills with this comprehensive course.',
          instructor: course.educator?.name || 'Expert Instructor',
          price: course.price || 0,
          rating: course.rating || 4.0 + Math.random(), // Add some variation to demo rating
          image: course.thumbnailUrl || course.image,
          difficulty: course.difficulty || course.level || ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
          enrolled: course.enrolledCount || Math.floor(Math.random() * 1500) + 100,
          enrolledCount: course.enrolledCount || Math.floor(Math.random() * 1500) + 100,
          duration: course.duration || `${Math.floor(Math.random() * 20) + 5}h ${Math.floor(Math.random() * 60)}m`,
          status: course.status || 'Approved',
          canEnroll: course.canEnroll !== false,
          createdAt: course.createdAt || new Date().toISOString()
        }));

        setAllCourses(transformedCourses);
        setFilteredCourses(transformedCourses);
      } catch (err) {
        console.error('❌ Error fetching approved courses:', err);
        setError(err.response?.data?.message || 'Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCourses();
  }, []);

  // Real-time search functionality
  useEffect(() => {
    let filtered = allCourses;

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerCaseQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(lowerCaseQuery) ||
        course.instructor.toLowerCase().includes(lowerCaseQuery) ||
        course.description.toLowerCase().includes(lowerCaseQuery) ||
        course.difficulty.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'enrolled':
          return b.enrolledCount - a.enrolledCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, allCourses, sortBy]);

  // Handle search input change (real-time)
  const handleSearchChange = (query) => {
    setSearchTerm(query);
  };

  // Handle search submission (if different logic needed)
  const handleSearch = (query) => {
    setSearchTerm(query);
    // Could navigate to update URL if needed
    // navigate(`/student/course-list/${encodeURIComponent(query)}`);
  };

  // Handle course card click
  const handleCourseClick = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <span className="text-gray-600 text-lg">Loading approved courses...</span>
      <span className="text-gray-500 text-sm mt-2">This may take a few moments</span>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
        <div className="text-red-600 mb-6">
          <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.352 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-3">Oops! Something went wrong</h3>
        <p className="text-red-600 mb-6">{message}</p>
        <button 
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Discover Courses'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collection of approved courses taught by industry experts. 
            Start your learning journey today!
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <SearchBar 
                onSearch={handleSearch} 
                onChange={handleSearchChange}
                initialQuery={searchTerm}
                placeholder="Search courses, instructors, or topics..."
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                name="sort"
                autocomplete="off"
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="recent">Most Recent</option>
                <option value="enrolled">Most Enrolled</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {filteredCourses.length > 0 ? (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      {searchTerm 
                        ? `Found ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                        : `${filteredCourses.length} approved course${filteredCourses.length !== 1 ? 's' : ''} available`
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      Sorted by {sortBy === 'recent' ? 'Most Recent' : 
                                sortBy === 'enrolled' ? 'Most Enrolled' :
                                sortBy === 'rating' ? 'Highest Rated' :
                                sortBy === 'price-low' ? 'Price: Low to High' :
                                'Price: High to Low'}
                    </p>
                  </div>
                </div>

                {/* Course Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCourses.map((course) => (
                    <div 
                      key={course.id}
                      onClick={() => handleCourseClick(course.id)}
                      className="transform transition duration-200"
                    >
                      <CourseCard course={course} isClickable={true} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* No Courses Found */
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm p-12 max-w-lg mx-auto">
                  <div className="text-gray-400 mb-6">
                    <svg className="h-20 w-20 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Courses Found</h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    {searchTerm 
                      ? `We couldn't find any approved courses matching "${searchTerm}". Try adjusting your search terms or browse all available courses.`
                      : 'No approved courses are currently available. Our team is working to add more content soon!'
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilteredCourses(allCourses);
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Clear search and view all courses
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesList;