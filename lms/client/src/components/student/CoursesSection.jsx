import React from 'react';
import CourseCard from './CourseCard'; // Ensure CourseCard is correctly imported

const CoursesSection = ({ title, subtitle, courses }) => {
  // Provide default props if not passed for safe rendering
  const defaultCourses = [
    { id: 101, title: 'Default Course 1', instructor: 'Default Instructor', rating: 4.0, image: '/assets/course_1.jpg' },
    { id: 102, title: 'Default Course 2', instructor: 'Default Instructor', rating: 5.0, image: '/assets/course_2.jpg' },
    { id: 103, title: 'Default Course 3', instructor: 'Default Instructor', rating: 3.0, image: '/assets/course_3.jpg' },
    { id: 104, title: 'Default Course 4', instructor: 'Default Instructor', rating: 4.0, image: '/assets/course_4.jpg' },
    
  ];

  const coursesToDisplay = courses && courses.length > 0 ? courses : defaultCourses;

  return (
    <section className="bg-gray-50" data-aos="fade-up">
      <div className="container mx-auto px-4 py-12">
        {title && <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>}
        {subtitle && <p className="text-center text-gray-600 mb-8">{subtitle}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coursesToDisplay.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;