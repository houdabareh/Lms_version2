'use client';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../../components/student/Rating';
import { FaWhatsapp } from 'react-icons/fa';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  const handleEnrollNow = () => {
    // Debug logging
    console.log('Student CourseDetails - Course ID:', id);
    console.log('Student CourseDetails - Navigating to:', `/checkout/${id}`);
    
    // Navigate to checkout page with course ID
    navigate(`/checkout/${id}`);
  };

  // Mock course data (expanded with more details and example asset paths)
  const coursesData = {
    '1': {
      id: 1,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React.js, including components, props, state, and hooks. Build your first React application and understand its core concepts. This course is designed for beginners and assumes no prior React knowledge.',
      instructor: 'John Doe',
      instructorBio: 'John is a senior software engineer with 10 years of experience in front-end development, specializing in React and modern web technologies. He is passionate about teaching and has trained thousands of aspiring developers.',
      duration: '10 hours',
      price: 29.99,
      originalPrice: 49.99, // Added for optional discount display
      category: 'Web Development', // Added category
      level: 'Beginner', // Keep existing level from CourseCard for consistency
      enrolledStudents: 15234, // Added enrollment stats
      rating: 4.5,
      image: '/assets/course_1.png',
      videoPreview: 'https://www.youtube.com/embed/gbAdFfSdtQ4', // Corrected YouTube embed URL
      whatsIncluded: [
        '10 hours of on-demand video',
        '5 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Access on mobile and TV',
      ],
      badges: [
        'Bestseller',
        'Top Rated',
      ],
      syllabus: [
        { title: 'Module 1: Getting Started', content: 'Introduction to React, setting up development environment, JSX syntax. Understanding the virtual DOM and component-based architecture.' },
        { title: 'Module 2: Components and Props', content: 'Functional components, class components, passing data with props, prop types, and default props.' },
        { title: 'Module 3: State and Lifecycle', content: 'Managing component state, lifecycle methods (class components), useEffect hook (functional components), and data fetching.' },
        { title: 'Module 4: Handling Events', content: 'Event handling in React, synthetic events, and common event patterns.' },
        { title: 'Module 5: React Router', content: 'Client-side routing with React Router v6, nested routes, and route parameters.' },
        { title: 'Module 6: Forms and Controlled Components', content: 'Building controlled forms, handling input changes, and form validation.' },
        { title: 'Module 7: Context API and Redux (Introduction)', content: 'Understanding Context API for global state, and a brief introduction to Redux for complex state management.' },
        { title: 'Module 8: Project Build', content: 'Building a complete mini-project to apply all learned concepts.' },
      ],
    },
    '2': {
      id: 2,
      title: 'Advanced JavaScript',
      description: 'Dive deep into advanced JavaScript concepts like closures, prototypes, asynchronous JavaScript, ES6+ features, and more. Master JavaScript for complex applications. This course is for developers who already have a good grasp of JavaScript basics.',
      instructor: 'Jane Smith',
      instructorBio: 'Jane is a JavaScript expert and a popular tech educator. She has contributed to several open-source projects and regularly speaks at conferences worldwide.',
      duration: '15 hours',
      price: 39.99,
      originalPrice: 59.99, // Added for optional discount display
      category: 'Web Development', // Added category
      level: 'Intermediate', // Keep existing level
      enrolledStudents: 9876, // Added enrollment stats
      rating: 4.8,
      image: '/assets/course_2.png',
      videoPreview: 'https://www.youtube.com/embed/jS4aFq5-91M', // Example YouTube embed (Async JS Tutorial)
      whatsIncluded: [
        '15 hours of on-demand video',
        '8 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Access on mobile and TV',
      ],
      badges: [
        'Popular',
      ],
      syllabus: [
        { title: 'Module 1: ES6+ Features', content: 'Arrow functions, let/const, destructuring, spread/rest operators, modules.' },
        { title: 'Module 2: Asynchronous JavaScript', content: 'Callbacks, Promises, Async/Await, Event Loop deep dive.' },
        { title: 'Module 3: Closures and Scope', content: 'Deep understanding of closures and lexical scoping, practical applications.' },
        { title: 'Module 4: Prototypes and Inheritance', content: 'Prototype chain, classical vs. prototypal inheritance, constructor functions.' },
        { title: 'Module 5: Advanced Array Methods', content: 'Map, filter, reduce, and other useful array manipulations.' },
        { title: 'Module 6: Error Handling', content: 'Try-catch, custom errors, and best practices for robust applications.' },
      ],
    },
    '3': {
      id: 3,
      title: 'Tailwind CSS Masterclass',
      description: 'Master Tailwind CSS to build stunning, responsive web interfaces with speed. Learn utility-first CSS, custom configurations, and advanced techniques for modern web design. This course is for developers looking to accelerate their UI development.',
      instructor: 'David Lee',
      instructorBio: 'David is a seasoned front-end developer and a Tailwind CSS enthusiast. He has built numerous production-ready applications using Tailwind and loves sharing his expertise.',
      duration: '8 hours',
      price: 24.99,
      originalPrice: 39.99,
      category: 'Web Design',
      level: 'Beginner',
      enrolledStudents: 18765,
      rating: 4.2,
      image: '/assets/course_3.png',
      videoPreview: 'https://www.youtube.com/embed/p_Vf0njb3aI', // Example Tailwind CSS video
      whatsIncluded: [
        '8 hours of on-demand video',
        '4 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
      ],
      badges: [
        'Trending',
      ],
      syllabus: [
        { title: 'Module 1: Tailwind Fundamentals', content: 'Introduction to utility-first CSS, setting up Tailwind, and basic styling.' },
        { title: 'Module 2: Responsive Design', content: 'Building responsive layouts with Tailwind\'s breakpoints.' },
        { title: 'Module 3: Customization', content: 'Extending and customizing Tailwind CSS configuration.' },
      ],
    },
    '4': {
      id: 4,
      title: 'Node.js for Beginners',
      description: 'Learn the fundamentals of Node.js and build scalable back-end applications. Cover topics like asynchronous programming, Express.js, and database integration. Perfect for aspiring full-stack developers.',
      instructor: 'Sarah Chen',
      instructorBio: 'Sarah is a back-end development expert with extensive experience in Node.js and cloud platforms. She enjoys simplifying complex concepts for new learners.',
      duration: '12 hours',
      price: 34.99,
      originalPrice: 54.99,
      category: 'Backend Development',
      level: 'Intermediate',
      enrolledStudents: 10500,
      rating: 4.6,
      image: '/assets/course_4.png',
      videoPreview: 'https://www.youtube.com/embed/fBNz5xF-Kx4', // Example Node.js video
      whatsIncluded: [
        '12 hours of on-demand video',
        '6 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
      ],
      badges: [
        'New Arrival',
      ],
      syllabus: [
        { title: 'Module 1: Node.js Basics', content: 'Introduction to Node.js, npm, and core modules.' },
        { title: 'Module 2: Express.js', content: 'Building RESTful APIs with Express.js.' },
        { title: 'Module 3: Database Integration', content: 'Connecting Node.js with MongoDB/PostgreSQL.' },
      ],
    },
    '5': {
      id: 5,
      title: 'Python for Data Science',
      description: 'Master Python for data analysis, visualization, and machine learning. Learn NumPy, Pandas, Matplotlib, and scikit-learn. Essential for anyone looking to enter the data science field.',
      instructor: 'Emily White',
      instructorBio: 'Emily is a data scientist and a passionate educator. She has worked on various data-driven projects in finance and healthcare industries.',
      duration: '18 hours',
      price: 49.99,
      originalPrice: 79.99,
      category: 'Data Science',
      level: 'All Levels',
      enrolledStudents: 22000,
      rating: 4.7,
      image: '/assets/course_5.jpg',
      videoPreview: 'https://www.youtube.com/embed/rfscVS0vtbw', // Example Python Data Science video
      whatsIncluded: [
        '18 hours of on-demand video',
        '10 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Access on mobile and TV',
      ],
      badges: [
        'Popular',
        'Highly Rated',
      ],
      syllabus: [
        { title: 'Module 1: Python Fundamentals', content: 'Review of Python basics relevant to data science.' },
        { title: 'Module 2: NumPy and Pandas', content: 'Data manipulation and analysis with NumPy and Pandas.' },
        { title: 'Module 3: Data Visualization', content: 'Creating compelling visualizations with Matplotlib and Seaborn.' },
        { title: 'Module 4: Machine Learning Intro', content: 'Introduction to scikit-learn and basic ML models.' },
      ],
    },
    '6': {
      id: 6,
      title: 'Full-Stack Web Development',
      description: 'Become a complete full-stack developer. Learn to build modern web applications using React, Node.js, Express, and MongoDB. This comprehensive course covers both front-end and back-end development.',
      instructor: 'Michael Brown',
      instructorBio: 'Michael is a full-stack developer with 15 years of experience building scalable web applications. He is a mentor and a coding bootcamp instructor.',
      duration: '40 hours',
      price: 99.99,
      originalPrice: 149.99,
      category: 'Full Stack',
      level: 'Intermediate',
      enrolledStudents: 30000,
      rating: 4.9,
      image: '/assets/course_6.jpg',
      videoPreview: 'https://www.youtube.com/embed/qwfE7fSdfW0', // Example Full-Stack video
      whatsIncluded: [
        '40 hours of on-demand video',
        '20 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Dedicated support',
      ],
      badges: [
        'Career Path',
        'Premium',
      ],
      syllabus: [
        { title: 'Module 1: Front-End with React', content: 'Building user interfaces with React components.' },
        { title: 'Module 2: Backend with Node.js/Express', content: 'Developing RESTful APIs and server-side logic.' },
        { title: 'Module 3: Database Integration (MongoDB)', content: 'Working with NoSQL databases.' },
        { title: 'Module 4: Authentication & Authorization', content: 'Implementing secure user systems.' },
        { title: 'Module 5: Deployment', content: 'Deploying full-stack applications to the cloud.' },
      ],
    },
    '7': {
      id: 7,
      title: 'UI/UX Design Principles',
      description: 'Learn the core principles of UI/UX design, from wireframing and prototyping to user research and usability testing. Create intuitive and engaging digital experiences. Ideal for aspiring designers and developers.',
      instructor: 'Olivia Green',
      instructorBio: 'Olivia is a lead UI/UX designer with a strong portfolio in product design. She focuses on user-centered design and accessible interfaces.',
      duration: '10 hours',
      price: 27.99,
      originalPrice: 44.99,
      category: 'Design',
      level: 'Beginner',
      enrolledStudents: 8500,
      rating: 4.3,
      image: '/assets/course_7.jpg',
      videoPreview: 'https://www.youtube.com/embed/unh_G1m-a_w', // Example UI/UX video
      whatsIncluded: [
        '10 hours of on-demand video',
        '7 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
      ],
      badges: [
        'Essentials',
      ],
      syllabus: [
        { title: 'Module 1: Intro to UI/UX', content: 'Understanding the difference and importance of UI/UX.' },
        { title: 'Module 2: User Research', content: 'Techniques for conducting user research and gathering insights.' },
        { title: 'Module 3: Wireframing & Prototyping', content: 'Tools and best practices for creating wireframes and interactive prototypes.' },
        { title: 'Module 4: Usability Testing', content: 'Methods for testing designs and iterating based on feedback.' },
      ],
    },
    '8': {
      id: 8,
      title: 'Machine Learning Fundamentals',
      description: 'Get started with Machine Learning. This course covers essential algorithms, data preprocessing, model evaluation, and popular ML libraries in Python. A great foundation for data scientists and AI enthusiasts.',
      instructor: 'Daniel Black',
      instructorBio: 'Daniel is a researcher and practitioner in Artificial Intelligence, specializing in machine learning algorithms and their real-world applications.',
      duration: '20 hours',
      price: 59.99,
      originalPrice: 89.99,
      category: 'Artificial Intelligence',
      level: 'Intermediate',
      enrolledStudents: 18000,
      rating: 4.9,
      image: '/assets/course_8.jpg',
      videoPreview: 'https://www.youtube.com/embed/ukzpgWk2eX8', // Example ML video
      whatsIncluded: [
        '20 hours of on-demand video',
        '12 downloadable resources',
        'Full lifetime access',
        'Certificate of completion',
        'Access on mobile and TV',
      ],
      badges: [
        'Advanced',
        'In-Demand',
      ],
      syllabus: [
        { title: 'Module 1: Intro to ML', content: 'What is Machine Learning? Supervised vs. Unsupervised Learning.' },
        { title: 'Module 2: Data Preprocessing', content: 'Cleaning, transforming, and preparing data for ML models.' },
        { title: 'Module 3: Supervised Learning', content: 'Linear Regression, Logistic Regression, Decision Trees.' },
        { title: 'Module 4: Unsupervised Learning', content: 'Clustering (K-Means), Dimensionality Reduction (PCA).', },
        { title: 'Module 5: Model Evaluation', content: 'Metrics for classification and regression models.' },
      ],
    },
  };

  const course = coursesData[id];

  if (!course) {
    return <div className="text-center py-10 text-xl font-semibold">Course not found!</div>;
  }

  const toggleAccordion = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Course Main Content */}
        <div className="lg:w-2/3">
          <img src={course.image} alt={course.title} className="w-full h-80 object-cover rounded-lg shadow-md mb-6" />
          <h1 className="text-4xl font-bold text-dark mb-2">{course.title}</h1>
          <p className="text-primary text-xl font-semibold mb-4">By {course.instructor}</p>
          
          {/* Category and Rating/Enrollment */}
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{course.category}</span>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">{course.level}</span>
            <div className="flex items-center">
              <Rating rating={course.rating} />
              <span className="text-gray-600 ml-2">({course.rating} / 5)</span>
              <span className="text-gray-600 ml-4">{course.enrolledStudents.toLocaleString()} Students Enrolled</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-6">{course.description}</p>

          {/* Video Preview */}
          <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="400"
              src={course.videoPreview}
              title="Course Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Instructor Info */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-dark mb-3">About the Instructor</h2>
            <div className="flex items-center mb-3">
              <img src="/assets/instructor_placeholder.jpg" alt="Instructor Avatar" className="w-16 h-16 rounded-full mr-4 object-cover" /> {/* Example asset path */}
              <div>
                <p className="font-bold text-lg text-dark">{course.instructor}</p>
                <p className="text-gray-600 text-sm">{course.instructorBio}</p>
              </div>
            </div>
          </div>

          {/* Syllabus Accordion */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-dark mb-4">Course Syllabus</h2>
            {
              course.syllabus.map((section, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg focus:outline-none text-dark"
                    onClick={() => toggleAccordion(`syllabus-${index}`)}
                  >
                    {section.title}
                    <span className="text-xl">{openSection === `syllabus-${index}` ? '−' : '+'}</span>
                  </button>
                  {openSection === `syllabus-${index}` && (
                    <div className="pb-4 text-gray-700">
                      {section.content}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:sticky lg:top-24">
            <h3 className="text-2xl font-bold text-dark mb-4">Course Details</h3>
            {course.originalPrice && course.originalPrice > course.price && (
                <p className="text-gray-500 line-through text-xl mb-1">${course.originalPrice}</p>
            )}
            <p className="text-primary font-bold text-4xl mb-4">${course.price}</p>

            <button 
              onClick={handleEnrollNow}
              className="w-full bg-gradient-to-r from-blue-500 to-yellow-400 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:shadow-xl transition duration-300 transform hover:scale-105 mb-4"
            >
              Enroll Now
            </button>

            {/* WhatsApp Share Button */}
            <a
              href={`https://wa.me/?text=Check%20out%20this%20course:%20${encodeURIComponent(course.title)}%20on%20Our%20Learning%20Platform!%20${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 w-full mb-6"
            >
              <FaWhatsapp className="w-6 h-6 mr-3" />
              Share on WhatsApp
            </a>

            <h4 className="font-bold text-lg text-dark mb-3">What's included:</h4>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {course.whatsIncluded.map((item, index) => (
                <li key={index} className="mb-2 last:mb-0">{item}</li>
              ))}
            </ul>

            <h4 className="font-bold text-lg text-dark mb-3">Badges:</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {course.badges.map((badge, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{badge}</span>
              ))}
            </div>

            <p className="text-gray-700"><span className="font-semibold text-dark">Estimated Duration:</span> {course.duration}</p>
          </div>
        </div>
      </div>
      {/* New Section: Enhance Your Learning Experience */}
      <div className="bg-gradient-to-br from-yellow-50 to-blue-50 p-6 md:p-10 rounded-lg mt-12 shadow-lg">
        <h2 className="text-3xl font-bold text-dark mb-4">Enhance Your Learning Experience</h2>
        <p className="text-gray-700 text-lg mb-8">
          Collaborate with peers, share insights, and get instant help with our AI Learning Assistant.
          Learning is more effective when you have the right tools and support!
        </p>

        {/* AI Assistant Info Box */}
        <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm mt-6">
          <h4 className="text-xl font-semibold text-dark mb-3">Need Help?</h4>
          <p className="text-gray-700">
            Ask questions about the course anytime! Our AI Learning Assistant is always ready to guide you — from clarifying modules to suggesting additional practice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
