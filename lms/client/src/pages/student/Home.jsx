import React from 'react';
import Hero from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import FeatureHighlights from '../../components/student/FeatureHighlights';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialsSection from '../../components/student/TestimonialsSection';
import CallToAction from '../../components/student/CallToAction';
import Navbar from '../../components/student/Navbar';
// Removed: CoverflowSlider is now integrated into Hero.jsx
// import CoverflowSlider from '../../components/student/CoverflowSlider'; 

const Home = () => {
  // Placeholder data for courses. Use assets from your project if available.
  const courses = [
    { id: 1, title: 'Introduction to React', instructor: 'John Doe', price: 29.99, rating: 4.5, image: '/assets/course_1.png', level: 'Beginner', enrolled: 1200, duration: '10h 30m' }, // Example asset path
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', price: 39.99, rating: 4.8, image: '/assets/course_2.png', level: 'Intermediate', enrolled: 850, duration: '15h 0m' },
    { id: 3, title: 'Tailwind CSS Masterclass', instructor: 'David Lee', price: 24.99, rating: 4.2, image: '/assets/course_3.png', level: 'Beginner', enrolled: 2100, duration: '8h 45m' },
    { id: 4, title: 'Node.js for Beginners', instructor: 'Sarah Chen', price: 34.99, rating: 4.6, image: '/assets/course_4.png', level: 'Intermediate', enrolled: 1500, duration: '12h 15m' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Companies className="mb-16" />
      <FeatureHighlights className="mb-16" />
      {/* Removed: CoverflowSlider is now part of Hero component */}
      {/* <div className="my-16">
        <CoverflowSlider />
      </div> */}
      <CoursesSection title="Popular Courses" subtitle="Explore our top-rated courses" courses={courses} className="mb-16" />
      <TestimonialsSection className="mb-16" />
      <CallToAction />
    </div>
  );
};

export default Home;