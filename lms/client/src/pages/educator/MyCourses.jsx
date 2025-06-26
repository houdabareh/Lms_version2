import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard'; // Reusing student CourseCard
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Get educator ID from AuthContext instead of localStorage
  const educatorId = user?._id;

  // Placeholder/example courses
  const exampleCourses = [
    {
      _id: 'ex1',
      title: 'React for Educators',
      educator: 'You',
      price: 99.99,
      rating: 4.7,
      thumbnailUrl: '/assets/course_1.png',
      status: 'Approved'
    },
    {
      _id: 'ex2',
      title: 'Advanced Tailwind CSS Techniques',
      educator: 'You',
      price: 79.99,
      rating: 4.5,
      thumbnailUrl: '/assets/course_2.png',
      status: 'Pending'
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!educatorId) {
          console.log('🔍 No educator ID found, waiting for AuthContext...');
          console.log('User from AuthContext:', user);
          return; // Don't fetch if educatorId is not set yet
        }
        
        const token = localStorage.getItem('token');
        
        console.log('🔍 Debug Info:');
        console.log('Educator ID:', educatorId);
        console.log('Token exists:', !!token);
        console.log('User role:', user?.role);
        console.log('User from AuthContext:', user);
        console.log('API URL:', `/api/courses?educator=${educatorId}`);
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        const res = await axios.get(`/api/courses?educator=${educatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('✅ API Response:', res.data);
        
        // Ensure courses data doesn't contain File objects that could cause rendering issues
        const cleanedCourses = res.data.map(course => ({
          ...course,
          // Ensure all properties are serializable strings/numbers, not File objects
          thumbnailUrl: typeof course.thumbnailUrl === 'string' ? course.thumbnailUrl : course.image || '/assets/course_1.png',
          image: typeof course.image === 'string' ? course.image : course.thumbnailUrl || '/assets/course_1.png'
        }));
        
        setCourses(cleanedCourses);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load courses:', err);
        
        let errorMessage = 'Failed to load courses';
        if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'Access denied. You need educator privileges.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [educatorId, user]); // Add user as dependency

  const combinedCourses = [...exampleCourses, ...courses];

  return (
    <div className="flex flex-col flex-grow min-h-[calc(100vh-8rem)]">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <h3 className="font-bold">Error loading courses:</h3>
            <p>{typeof error === 'string' ? error : 'An error occurred while loading courses'}</p>
            {typeof error === 'string' && error.includes('Authentication') && (
              <div className="mt-2">
                <Link to="/login" className="text-blue-600 hover:underline">
                  → Go to Login Page
                </Link>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : combinedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {combinedCourses.map((course) => {
              // Add debugging to check for File objects or other non-serializable data
              console.log('Rendering course:', course);
              Object.keys(course).forEach(key => {
                if (course[key] instanceof File) {
                  console.warn(`⚠️ File object found in course.${key}:`, course[key]);
                }
              });
              
              // Create a safe course object with only serializable data
              const safeCourse = {
                ...course,
                // Ensure all values are serializable
                _id: course._id || `course-${Math.random()}`,
                title: typeof course.title === 'string' ? course.title : 'Untitled Course',
                educator: typeof course.educator === 'string' ? course.educator : 'Unknown',
                price: typeof course.price === 'number' ? course.price : 0,
                rating: typeof course.rating === 'number' ? course.rating : 0,
                thumbnailUrl: typeof course.thumbnailUrl === 'string' ? course.thumbnailUrl : '/assets/course_1.png',
                image: typeof course.image === 'string' ? course.image : course.thumbnailUrl || '/assets/course_1.png',
                status: typeof course.status === 'string' ? course.status : 'Approved'
              };
              
              return (
                <CourseCard key={safeCourse._id} course={safeCourse} showStatus />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">You haven't created any courses yet.</p>
        )}

        <div className="mt-8 text-center">
          <Link to="/educator/add-course">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Add New Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
