import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Clock, ShoppingBag, BookOpen, UserCircle, GlobeHemisphereWest, Question, ArrowRight, UserFocus, GraduationCap, UsersThree, ChartLineUp, EnvelopeSimple, TwitterLogo, LinkedinLogo, FacebookLogo, Sun, MoonStars } from '@phosphor-icons/react';
import { ThemeContext } from '../context/ThemeContext';
import logo from '../assets/logo.png'; // Make sure this path is correct

// Mock course data
const courseData = [
  {
    id: 1,
    thumbnail: '../../assets/course_1.png',
    category: 'Technology',
    title: 'AI for Beginners: Fundamentals & Applications',
    description: 'Learn the basics of Artificial Intelligence, machine learning concepts, and how AI powers modern applications in various industries.',
    rating: 4.8,
    enrollments: '1.2K',
    duration: '10h',
    price: 49,
    badge: 'Top Rated',
    slug: 'ai-for-beginners-fundamentals-applications',
  },
  {
    id: 2,
    thumbnail: '../../assets/course_2.png',
    category: 'Business',
    title: 'Digital Marketing Mastery: SEO, SEM & Social Media',
    description: 'Master essential digital marketing strategies including SEO, SEM, content marketing, and social media campaigns to boost your brand.',
    rating: 4.7,
    enrollments: '980',
    duration: '15h',
    price: 79,
    badge: 'Trending',
    slug: 'digital-marketing-mastery-seo-sem-social-media',
  },
  {
    id: 3,
    thumbnail: '../../assets/course_3.png',
    category: 'Development',
    title: 'Full Stack Web Development: MERN Stack',
    description: 'Become a full-stack developer by building dynamic web applications using MongoDB, Express.js, React, and Node.js.',
    rating: 4.9,
    enrollments: '2.5K',
    duration: '40h',
    price: 199,
    badge: 'New',
    slug: 'full-stack-web-development-mern-stack',
  },
  {
    id: 4,
    thumbnail: '../../assets/course_4.png',
    category: 'Data Science',
    title: 'Data Science with Python: From Basics to Advanced',
    description: 'Explore data analysis, visualization, and machine learning using Python libraries like Pandas, NumPy, and Scikit-learn.',
    rating: 4.6,
    enrollments: '1.8K',
    duration: '25h',
    price: 129,
    badge: 'Popular',
    slug: 'data-science-with-python-from-basics-to-advanced',
  },
  {
    id: 5,
    thumbnail: '../../assets/course_5.jpg',
    category: 'Design',
    title: 'Graphic Design Fundamentals: Adobe Creative Suite',
    description: 'Learn the principles of graphic design and master tools like Photoshop, Illustrator, and InDesign to create stunning visuals.',
    rating: 4.5,
    enrollments: '750',
    duration: '20h',
    price: 99,
    badge: '',
    slug: 'graphic-design-fundamentals-adobe-creative-suite',
  },
];

const CourseCard = ({ course }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] cursor-pointer
                 transform hover:shadow-2xl hover:border hover:border-primary-light dark:hover:border-accent-dark"
      style={{
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        border: '1px solid transparent', // Initial transparent border for smooth transition
      }}
    >
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-t-2xl" />
        {course.badge && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-primary-light to-accent-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {course.badge}
          </span>
        )}
      </div>
      <div className="p-6">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3
          ${course.category === 'Technology' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
            course.category === 'Business' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
            course.category === 'Development' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' :
            course.category === 'Data Science' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          {course.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">{course.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Star weight="fill" className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{course.rating} ({course.enrollments} enrolled)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-primary-light dark:text-accent-gold" />
            <span className="text-sm font-medium">{course.duration}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-2xl font-bold text-primary-dark dark:text-accent-gold">${course.price}</span>
          <button className="flex items-center px-6 py-3 bg-gradient-to-r from-[#009FE3] to-[#A36FFF] text-white rounded-lg shadow-md
                             hover:from-[#1D3C6D] hover:to-[#F5AF00] transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg
                             focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:ring-opacity-50">
            <Link to={`/courses/${course.slug}`} className="flex items-center text-white w-full h-full justify-center">
              Enroll Now <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Courses = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define color palette from the logo
  const colors = {
    primaryBlue: '#009FE3',
    deepGradient: '#1D3C6D',
    accentGold: '#F5AF00',
    midnightGray: '#1A1A1A',
    gradientViolet: '#A36FFF',
    backgroundLight: '#F5F8FF',
    backgroundDark: '#121212',
    textLight: '#1A1A1A',
    textDark: '#F5F8FF',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#1A1A1A] text-gray-100' : 'bg-[#F5F8FF] text-gray-900'} font-inter`}
    >
      {/* Sticky Header - copied from Homepage.jsx */}
      <header className={`fixed top-0 left-0 w-full ${theme === 'dark' ? 'bg-[#1A1A1A]/90 backdrop-blur-md' : 'bg-[#F5F8FF]/90 backdrop-blur-md'} shadow-md z-50 py-4 px-6 flex justify-between items-center transition-colors duration-300`}>
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="GFS LMS Logo" className="h-9" />
          <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#FDBA11] font-satoshi">GFS LMS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium">
          {/* Public-only navigation */}
          <Link to="/" className={`relative group ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200 cursor-pointer`}>
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#007BFF] dark:bg-[#FDBA11] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/courses" className={`relative group ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200 cursor-pointer`}>
            Courses
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#007BFF] dark:bg-[#FDBA11] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/about" className={`relative group ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200 cursor-pointer`}>
            About Us
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#007BFF] dark:bg-[#FDBA11] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/support" className={`relative group ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200 cursor-pointer`}>
            Support
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#007BFF] dark:bg-[#FDBA11] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/login" className="px-5 py-2 bg-gradient-to-r from-[#007BFF] to-[#A36FFF] text-white rounded-full hover:from-[#0056B3] hover:to-[#8E5FFF] transition-all duration-300 shadow-lg cursor-pointer">Login</Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] dark:focus:ring-[#FDBA11] transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" weight="fill"/> : <MoonStars className="h-6 w-6" weight="fill"/>}
          </button>
        </nav>
        {/* Mobile menu button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Menu - copied from Homepage.jsx */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`lg:hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} py-4 px-6 shadow-lg border-t
                        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <ul className="flex flex-col space-y-3">
              {/* Hardcode links as in Homepage.jsx for consistency */}
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors duration-300
                              ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors duration-300
                              ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors duration-300
                              ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-medium transition-colors duration-300
                              ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-6 py-2 bg-gradient-to-r from-[#007BFF] to-[#A36FFF] text-white rounded-full font-semibold shadow-lg
                             hover:from-[#0056B3] hover:to-[#8E5FFF] transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20 pb-16 px-6 lg:px-8"> {/* Adjusted padding-top to account for fixed navbar */}
        <section className="container mx-auto py-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-extrabold text-center mb-12
                       bg-clip-text text-transparent bg-gradient-to-r from-primary-blue to-accent-gold"
          >
            Explore Our Comprehensive Courses
          </motion.h2>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseData.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer - Re-using the structure from Homepage.jsx for consistency */}
      <footer className={`relative py-12 ${theme === 'dark' ? 'bg-[#1A1A1A] text-gray-300' : 'bg-[#F5F8FF] text-gray-700'}`}>
        <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About GFS LMS</h4>
            <p className="text-sm">Empowering your future with AI-driven learning. We offer personalized, interactive, and certified educational experiences.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">About Us</Link></li>
              <li><Link to="/support" className="hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">Support</Link></li>
              <li><Link to="/terms" className="hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Connect With Us</h4>
            <p className="text-sm flex items-center mb-2"><EnvelopeSimple className="h-5 w-5 mr-2 text-[#007BFF] dark:text-[#FDBA11]" /> info@gfslms.com</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">
                <TwitterLogo weight="fill" className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">
                <LinkedinLogo weight="fill" className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#007BFF] dark:hover:text-[#FDBA11] transition-colors duration-200">
                <FacebookLogo weight="fill" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} GFS LMS. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
};

export default Courses;
