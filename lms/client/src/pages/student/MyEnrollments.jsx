import React from 'react';
// import CourseCard from '../../components/student/CourseCard'; // Can reuse CourseCard or make a specific one

const MyEnrollments = () => {
  // Placeholder data for enrolled courses
  const enrolledCourses = [
    { id: 1, title: 'Introduction to React', instructor: 'John Doe', progress: 75, totalLessons: 10, completedLessons: 7, image: '/assets/course_1.png' },
    { id: 5, title: 'Python for Data Science', instructor: 'Emily White', progress: 30, totalLessons: 12, completedLessons: 4, image: '/assets/course_2.png' },
    { id: 8, title: 'Machine Learning Fundamentals', instructor: 'Daniel Black', progress: 90, totalLessons: 8, completedLessons: 7, image: '/assets/course_3.png' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">My Enrollments</h1>
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <img src={course.image} alt="Course Thumbnail" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Instructor: {course.instructor}</p>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-700 dark:text-white">Progress</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-white">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{course.completedLessons} / {course.totalLessons} Lessons Completed</p>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">You are not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default MyEnrollments;