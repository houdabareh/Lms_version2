import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxTilt from 'react-parallax-tilt';
import CountUp from 'react-countup';

// Phosphor Icons for a modern look
import {
  Sparkle, GlobeHemisphereWest, GraduationCap, Briefcase,
  Star, Play, ArrowRight, Users, CurrencyDollar,
  BookOpen, Lightbulb, ChatText, GearSix,
  CheckCircle, ChartBar, DribbbleLogo, TwitterLogo, LinkedinLogo, FacebookLogo, EnvelopeSimple, UserCircle, ChalkboardTeacher, MonitorPlay,
  GlobeSimple, BookBookmark, ChartLineUp, MoonStars, Sun
} from '@phosphor-icons/react';

// Swiper for testimonials carousel
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { ThemeContext } from '../context/ThemeContext'; // Assuming you have a ThemeContext

// Asset Imports - Please ensure these paths are correct and files exist
import logo from '../assets/logo.png';
import heroIllustration from '../assets/hero-illustration.png';
import hat3d from '../assets/hat-3d3.png'; // Placeholder for educator section illustration
import addCourse3d from '../assets/add_course_3d.png'; // Placeholder for admin section illustration
import courseThumbnail1 from '../assets/course_1.png'; // Example course thumbnails
import courseThumbnail2 from '../assets/course_2.png';
import courseThumbnail3 from '../assets/course_3.png';
import testimonial1 from '../assets/profile_img_1.png'; // Example testimonial images
import testimonial2 from '../assets/profile_img_2.png';
import testimonial3 from '../assets/profile_img_3.png';


const Homepage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Subtext slider states
  const subtexts = ["Interactive", "Personalized", "Certified"];
  const [currentSubtextIndex, setCurrentSubtextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtextIndex((prevIndex) => (prevIndex + 1) % subtexts.length);
    }, 3000); // Change subtext every 3 seconds
    return () => clearInterval(interval);
  }, [subtexts.length]);


  // Dummy data for sections
  const courses = [
    { id: 1, title: 'AI for Beginners', category: 'Technology', rating: 4.8, enrollments: '1.2K', duration: '8h', price: '$49', image: courseThumbnail1, badge: 'Top Rated' },
    { id: 2, title: 'Digital Marketing Fundamentals', category: 'Business', rating: 4.7, enrollments: '900', duration: '10h', price: '$59', image: courseThumbnail2, badge: 'Trending' },
    { id: 3, title: 'Creative Writing Masterclass', category: 'Arts', rating: 4.9, enrollments: '1.5K', duration: '12h', price: '$79', image: courseThumbnail3, badge: 'New' },
    { id: 4, title: 'Data Science with Python', category: 'Technology', rating: 4.6, enrollments: '800', duration: '15h', price: '$89', image: courseThumbnail1, badge: 'Popular' },
  ];

  const testimonials = [
    { id: 1, quote: "GFS LMS transformed my career! The AI-driven paths were incredibly personalized and effective. Highly recommend!", name: "Jane Doe", role: "Student", image: testimonial1 },
    { id: 2, quote: "As an educator, this platform provides all the tools I need to connect with my students and manage courses efficiently. The support is fantastic!", name: "Dr. Alex Lee", role: "Educator", image: testimonial2 },
    { id: 3, quote: "Our company saw a significant improvement in employee skills after implementing GFS LMS for corporate training. The analytics are powerful.", name: "Sarah Chen", role: "HR Manager", image: testimonial3 },
  ];

  const trustCards = [
    {
      id: 1,
      icon: Users,
      title: "1M+ Learners",
      description: "Active students across 100+ countries benefiting daily.",
      iconColor: "#007BFF", // Primary Blue
    },
    {
      id: 2,
      icon: ChalkboardTeacher,
      title: "10K+ Educators",
      description: "Expert instructors shaping the future of education.",
      iconColor: "#FDBA11", // Accent Gold
    },
    {
      id: 3,
      icon: BookBookmark,
      title: "500+ Courses",
      description: "Diverse catalog from AI to Creative Arts, constantly growing.",
      iconColor: "#A36FFF", // Gradient Violet
    },
    {
      id: 4,
      icon: ChartLineUp,
      title: "98% Success Rate",
      description: "Our graduates achieve their career goals faster.",
      iconColor: "#007BFF", // Primary Blue
    },
    {
      id: 5,
      icon: Star,
      title: "Top Rated",
      description: "Consistently receiving 5-star reviews from our community.",
      iconColor: "#F5AF00", // Accent Gold (Original)
    },
  ];


  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)",
      transition: { duration: 0.3 }
    }
  };

  const ctaCardVariants = {
    initial: {
      boxShadow: theme === 'dark' ? "0 0 10px rgba(255,255,255,0.1)" : "0 0 10px rgba(0,0,0,0.1)",
      scale: 1,
    },
    hover: {
      scale: 1.05,
      boxShadow: theme === 'dark' ? "0 0 30px rgba(245, 175, 0, 0.5), 0 0 15px rgba(245, 175, 0, 0.3)" : "0 0 30px rgba(0, 123, 255, 0.5), 0 0 15px rgba(0, 123, 255, 0.3)", // Primary blue glow (light) / Accent Gold glow (dark)
      transition: { duration: 0.3 }
    }
  };

  const glowEffectClass = theme === 'dark' ? 'drop-shadow-lg-yellow' : 'drop-shadow-lg-blue';


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#1A1A1A] text-gray-100' : 'bg-[#F5F8FF] text-gray-900'} font-inter`}
    >
      {/* Sticky Header */}
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
        {/* Mobile menu button placeholder */}
        <button className={`md:hidden p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero Section */}
        <section className={`relative overflow-hidden py-20 md:py-32 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-[#1A1A1A] to-[#1D3C6D]' : 'bg-gradient-to-br from-[#F5F8FF] to-[#A36FFF]/10'}`}>
          {/* Shimmering Light Gradient Background */}
          <div className="absolute inset-0 z-0">
            <div className={`absolute inset-0 background-gradient-animation ${theme === 'dark' ? 'dark-gradient-shimmer' : 'light-gradient-shimmer'}`}></div>
          </div>
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 z-0 opacity-40">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`absolute w-80 h-80 ${theme === 'dark' ? 'bg-[#007BFF]/30' : 'bg-[#007BFF]/30'} rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-slow top-1/4 left-1/4`}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className={`absolute w-80 h-80 ${theme === 'dark' ? 'bg-[#A36FFF]/30' : 'bg-[#A36FFF]/30'} rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-slow animation-delay-2000 top-1/2 right-1/4`}
            ></motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              className={`absolute w-80 h-80 ${theme === 'dark' ? 'bg-[#FDBA11]/30' : 'bg-[#FDBA11]/30'} rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob-slow animation-delay-4000 bottom-1/4 left-1/2`}
            ></motion.div>
          </div>
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-gray-100 font-satoshi">
                Shape Tomorrow's Leaders With <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#FDBA11]">AI-Driven Learning</span>
              </h1>
              <div className="h-8 mb-8 overflow-hidden">
                <AnimatePresence mode='wait'>
                  <motion.p
                    key={currentSubtextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-700 dark:text-gray-300 font-inter"
                  >
                    {subtexts[currentSubtextIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 font-inter">
                Unlock personalized learning paths, engage in live interactive sessions, and gain industry-recognized certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.a
                  href="#why-choose-us" // Smooth scroll to next section
                  className="px-8 py-4 bg-gradient-to-r from-[#007BFF] to-[#A36FFF] text-white font-semibold rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 123, 255, 0.8)" }} // Primary Blue Glow
                >
                  <Sparkle weight="fill" className="h-6 w-6" /> <span>Get Started</span>
                </motion.a>
                <Link
                  to="/educator"
                  className={`px-8 py-4 border border-[#007BFF] dark:border-[#FDBA11] ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'} font-semibold rounded-full flex items-center justify-center space-x-2 hover:bg-[#007BFF]/10 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                >
                  <GraduationCap weight="bold" className="h-6 w-6" /> <span>Educator? Teach with Us</span>
                </Link>
              </div>

              {/* Glassmorphism Card for Login/Role Selection */}
              <motion.div
                className={`mt-16 p-8 rounded-xl shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'glassmorphism-dark-card' : 'glassmorphism-light-card'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-center">Ready to Dive In?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Link
                    to="/student/dashboard"
                    className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-[#1D3C6D]/60 hover:bg-[#1D3C6D]/80' : 'bg-[#007BFF]/10 hover:bg-[#007BFF]/20'} shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer`}
                  >
                    <UserCircle weight="fill" className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-[#007BFF]'}`} />
                    <span className="font-semibold text-lg">Student</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Start Learning →</span>
                  </Link>
                  <Link
                    to="/educator"
                    className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-[#1D3C6D]/60 hover:bg-[#1D3C6D]/80' : 'bg-green-50/60 hover:bg-green-100/80'} shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer`}
                  >
                    <ChalkboardTeacher weight="fill" className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    <span className="font-semibold text-lg">Educator</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Teach & Earn →</span>
                  </Link>
                  <Link
                    to="/admin-login"
                    className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-[#1D3C6D]/60 hover:bg-[#1D3C6D]/80' : 'bg-[#A36FFF]/10 hover:bg-[#A36FFF]/20'} shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer`}
                  >
                    <MonitorPlay weight="fill" className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-[#A36FFF]'}`} />
                    <span className="font-semibold text-lg">Admin</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage Platform →</span>
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.img
                src={heroIllustration}
                alt="AI-Driven Learning Illustration"
                className="w-full max-w-md md:max-w-xl"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.3 }}
              />
            </div>
          </div>
        </section>

        {/* Trusted By Global Learners & Educators Section */}
        <motion.section
          className={`py-16 px-4 ${theme === 'dark' ? 'bg-[#1D3C6D]' : 'bg-[#F5F8FF]'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 font-satoshi">Trusted by Global Learners & Educators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {trustCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className={`p-6 rounded-xl shadow-lg transition-all duration-300 group ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} cursor-pointer`}
                  variants={cardVariants}
                  transition={{ delay: 0.1 * index }}
                  whileHover="hover"
                >
                  <motion.div
                    className="flex justify-center items-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <card.icon weight="fill" className="h-12 w-12" style={{ color: card.iconColor }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">
                    {card.id === 1 || card.id === 2 ? (
                      <CountUp end={card.id === 1 ? 1 : 10} suffix={card.id === 1 ? "M+" : "K+"} duration={2} enableScrollSpy={true} scrollSpyOnce={true} />
                    ) : (
                      card.title
                    )}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 text-sm`}>{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <section id="why-choose-us" className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 font-satoshi">Why Choose GFS LMS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'} cursor-pointer`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                <Sparkle weight="fill" className={`h-12 w-12 ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold mb-3">AI-Powered Learning Paths</h3>
                <p className={`text-gray-600 dark:text-gray-300 font-inter`}>Personalized recommendations and adaptive content for optimal progress.</p>
              </motion.div>
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'} cursor-pointer`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlobeHemisphereWest weight="fill" className={`h-12 w-12 ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold mb-3">Live Interactive Sessions</h3>
                <p className={`text-gray-600 dark:text-gray-300 font-inter`}>Engage directly with expert educators and peers in real-time.</p>
              </motion.div>
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'} cursor-pointer`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GraduationCap weight="fill" className={`h-12 w-12 ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold mb-3">Industry Certifications</h3>
                <p className={`text-gray-600 dark:text-gray-300 font-inter`}>Earn recognized certifications to boost your career prospects.</p>
              </motion.div>
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'} cursor-pointer`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Briefcase weight="fill" className={`h-12 w-12 ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold mb-3">Career-Ready Skills</h3>
                <p className={`text-gray-600 dark:text-gray-300 font-inter`}>Acquire practical skills directly applicable to today's job market.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1D3C6D]' : 'bg-[#F5F8FF]'}`}>
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 font-satoshi">Popular Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <ParallaxTilt
                  key={course.id}
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  perspective={1000}
                  scale={1.02}
                  transitionEasing="cubic-bezier(.03,.98,.52,.99)"
                  glareEnable={true}
                  glareMaxOpacity={0.4}
                  gyroscope={true}
                >
                  <motion.div
                    className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * course.id }}
                  >
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover"/>
                    {course.badge && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FDBA11] to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse-badge flex items-center">
                        <Star weight="fill" className="inline-block h-4 w-4 mr-1"/> {course.badge}
                      </span>
                    )}
                    <div className="p-6">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block ${theme === 'dark' ? 'text-[#007BFF] bg-[#007BFF]/20' : 'text-[#007BFF] bg-[#007BFF]/10'}`}>
                        {course.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                      <div className={`flex items-center text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Star weight="fill" className="h-5 w-5 text-[#FDBA11] mr-1" /> {course.rating} ({course.enrollments} enrolled)
                      </div>
                      <div className={`flex justify-between items-center text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        <span>Duration: {course.duration}</span>
                        <span className={`font-bold text-lg ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'}`}>{course.price}</span>
                      </div>
                      <Link to={`/course/${course.id}`} className={`mt-4 block text-center px-6 py-3 ${theme === 'dark' ? 'bg-[#FDBA11] hover:bg-[#D49000] text-gray-900' : 'bg-[#007BFF] hover:bg-[#0056B3] text-white'} rounded-full transition-colors duration-300 cursor-pointer`}>
                        View Course
                      </Link>
                    </div>
                  </motion.div>
                </ParallaxTilt>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/courses" className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Explore All Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials/Reviews */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 font-satoshi">What Our Students & Educators Say</h2>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="pb-12" // Padding for pagination dots
            >
              {testimonials.map(testimonial => (
                <SwiperSlide key={testimonial.id}>
                  <motion.div
                    className={`p-8 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'} cursor-pointer`}
                    whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                  >
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className={`w-24 h-24 rounded-full object-cover mb-4 border-4 ${theme === 'dark' ? 'border-[#FDBA11] glow-avatar-dark' : 'border-[#007BFF] glow-avatar-light'}`}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                    />
                    <p className={`text-lg italic mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.quote}"</p>
                    <p className={`font-bold ${theme === 'dark' ? 'text-[#FDBA11]' : 'text-[#007BFF]'}`}>{testimonial.name}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} weight="fill" className="h-5 w-5 text-[#FDBA11]" />
                      ))}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* For Educators Section */}
        <section className={`py-20 px-4 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-r from-[#1A1A1A] to-[#1D3C6D]' : 'bg-gradient-to-r from-[#F5F8FF] to-[#A36FFF]/10'}`}>
          <div className="absolute inset-0 z-0 opacity-20">
            {/* Additional background elements for visual interest */}
            <div className={`absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl ${theme === 'dark' ? 'bg-[#007BFF]/30' : 'bg-[#007BFF]/30'} opacity-30 top-10 right-10 animate-blob`}></div>
            <div className={`absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl ${theme === 'dark' ? 'bg-[#A36FFF]/30' : 'bg-[#A36FFF]/30'} opacity-30 bottom-10 left-10 animate-blob animation-delay-2000`}></div>
          </div>
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <h2 className="text-4xl font-bold mb-6 font-satoshi">Join as an Educator</h2>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-inter`}>
                Share your expertise with a global audience and earn by teaching. GFS LMS provides you with powerful tools to create, manage, and deliver engaging courses.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'}`}>
                  <Users weight="fill" className="h-10 w-10 text-[#007BFF] dark:text-[#007BFF] mx-auto mb-2" />
                  <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    <CountUp end={50} suffix="K+" duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} />
                  </p>
                  <p className={`text-gray-600 dark:text-gray-300`}>Active Students</p>
                </div>
                <div className={`p-6 rounded-lg shadow-md text-center ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'}`}>
                  <CurrencyDollar weight="fill" className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    $<CountUp end={1} suffix="M+" duration={2.5} enableScrollSpy={true} scrollSpyOnce={true} />
                  </p>
                  <p className={`text-gray-600 dark:text-gray-300`}>Earned by Educators</p>
                </div>
              </div>
              <Link
                to="/educator"
                className={`px-8 py-4 ${theme === 'dark' ? 'bg-[#FDBA11] hover:bg-[#D49000] text-gray-900' : 'bg-[#007BFF] hover:bg-[#0056B3] text-white'} font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              >
                Start Teaching Today
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.img
                src={hat3d}
                alt="Educator Dashboard Mockup"
                className="w-full max-w-lg rounded-xl shadow-xl"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.3 }}
              />
            </div>
          </div>
        </section>

        {/* Enterprise & Admin Panel */}
        <section className={`py-20 px-4 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-l from-[#1D3C6D] to-[#1A1A1A]' : 'bg-gradient-to-l from-[#A36FFF]/10 to-[#F5F8FF]'}`}>
          <div className="absolute inset-0 z-0 opacity-20">
            {/* Additional background elements for visual interest */}
            <div className={`absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl ${theme === 'dark' ? 'bg-[#007BFF]/30' : 'bg-[#007BFF]/30'} opacity-30 top-10 left-10 animate-blob`}></div>
            <div className={`absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl ${theme === 'dark' ? 'bg-[#FDBA11]/30' : 'bg-[#FDBA11]/30'} opacity-30 bottom-10 right-10 animate-blob animation-delay-2000`}></div>
          </div>
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6 font-satoshi">For Enterprises & Administrators</h2>
            <p className={`text-xl mb-12 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-inter`}>
              Empower your workforce with custom learning solutions, robust analytics, and seamless administration.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="md:w-1/2">
                <motion.img
                  src={addCourse3d}
                  alt="Admin Panel Screenshot"
                  className="w-full max-w-xl rounded-xl shadow-xl"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.3 }}
                />
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <ul className={`space-y-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start md:items-center">
                    <CheckCircle weight="fill" className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    Customizable Training Programs
                  </li>
                  <li className="flex items-start md:items-center">
                    <ChartBar weight="fill" className="h-6 w-6 text-[#007BFF] mr-3 flex-shrink-0" />
                    Comprehensive Analytics & Reporting
                  </li>
                  <li className="flex items-start md:items-center">
                    <Users weight="fill" className="h-6 w-6 text-[#A36FFF] mr-3 flex-shrink-0" />
                    Efficient User Management
                  </li>
                </ul>
                <Link
                  to="/request-demo"
                  className="mt-10 inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Request a Demo <ArrowRight weight="bold" className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Role-Based CTA Section */}
        <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1D3C6D]' : 'bg-[#F5F8FF]'}`}>
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 font-satoshi">Ready to Get Started? Choose Your Path.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'}`}
                variants={ctaCardVariants}
                initial="initial"
                whileHover="hover"
              >
                <h3 className="text-2xl font-bold mb-4">I'm a Student</h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Explore courses, join live sessions, and boost your skills.</p>
                <Link to="/student/dashboard" className={`px-6 py-3 ${theme === 'dark' ? 'bg-[#007BFF] hover:bg-[#0056B3]' : 'bg-[#007BFF] hover:bg-[#0056B3]'} text-white rounded-full transition-colors duration-300 cursor-pointer`}>
                  Start Learning
                </Link>
              </motion.div>
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'}`}
                variants={ctaCardVariants}
                initial="initial"
                whileHover="hover"
              >
                <h3 className="text-2xl font-bold mb-4">I'm an Educator</h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Create courses, manage students, and share your knowledge.</p>
                <Link to="/educator" className={`px-6 py-3 ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-full transition-colors duration-300 cursor-pointer`}>
                  Teach Now
                </Link>
              </motion.div>
              <motion.div
                className={`p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'glassmorphism-dark-card-soft' : 'glassmorphism-light-card-soft'}`}
                variants={ctaCardVariants}
                initial="initial"
                whileHover="hover"
              >
                <h3 className="text-2xl font-bold mb-4">I'm an Admin / Enterprise</h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Manage your organization's learning, track progress, and more.</p>
                <Link to="/admin-login" className={`px-6 py-3 ${theme === 'dark' ? 'bg-[#A36FFF] hover:bg-[#8E5FFF]' : 'bg-[#A36FFF] hover:bg-[#8E5FFF]'} text-white rounded-full transition-colors duration-300 cursor-pointer`}>
                  Admin Login
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className={`p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-[#FDBA11] text-[#1A1A1A]' : 'bg-[#007BFF] text-white'} cursor-pointer`}>
          <ChatText weight="fill" className="h-7 w-7" />
        </button>
      </div>

      {/* Footer */}
      <footer className={`py-12 px-4 ${theme === 'dark' ? 'bg-gradient-to-r from-[#1A1A1A] to-[#1D3C6D] text-gray-300' : 'bg-[#1D3C6D] text-white'}`}>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GFS LMS</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>Empowering your future through AI-driven learning.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className={`text-gray-400 ${theme === 'dark' ? `hover:text-[#FDBA11] ${glowEffectClass}` : `hover:text-white ${glowEffectClass}`} transition-colors cursor-pointer`} aria-label="Facebook">
                <FacebookLogo weight="fill" className="h-6 w-6" />
              </a>
              <a href="#" className={`text-gray-400 ${theme === 'dark' ? `hover:text-[#FDBA11] ${glowEffectClass}` : `hover:text-white ${glowEffectClass}`} transition-colors cursor-pointer`} aria-label="Twitter">
                <TwitterLogo weight="fill" className="h-6 w-6" />
              </a>
              <a href="#" className={`text-gray-400 ${theme === 'dark' ? `hover:text-[#FDBA11] ${glowEffectClass}` : `hover:text-white ${glowEffectClass}`} transition-colors cursor-pointer`} aria-label="LinkedIn">
                <LinkedinLogo weight="fill" className="h-6 w-6" />
              </a>
              <a href="#" className={`text-gray-400 ${theme === 'dark' ? `hover:text-[#FDBA11] ${glowEffectClass}` : `hover:text-white ${glowEffectClass}`} transition-colors cursor-pointer`} aria-label="Dribbble">
                <DribbbleLogo weight="fill" className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-300 hover:text-white'} transition-colors cursor-pointer`}>About Us</Link></li>
              <li><Link to="/contact" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-300 hover:text-white'} transition-colors cursor-pointer`}>Contact</Link></li>
              <li><Link to="/support" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-300 hover:text-white'} transition-colors cursor-pointer`}>Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-300 hover:text-white'} transition-colors cursor-pointer`}>Terms of Service</Link></li>
              <li><Link to="/privacy" className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-300 hover:text-white'} transition-colors cursor-pointer`}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>123 Learning Lane, Knowledge City, World</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>info@gfslms.com</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>+1 (555) 123-4567</p>
            <div className="mt-4">
              {/* Newsletter Input */}
              <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}>Subscribe to our newsletter:</p>
              <div className="flex">
                <input
                  type="email"
                  id="homepage-newsletter-email"
                  name="email"
                  autocomplete="email"
                  placeholder="Your email"
                  className={`p-2 rounded-l-md w-full focus:outline-none ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-700 text-white border border-gray-600'}`}
                />
                <button
                  className={`p-2 rounded-r-md ${theme === 'dark' ? 'bg-[#FDBA11] text-[#1A1A1A] hover:bg-[#D49000]' : 'bg-[#007BFF] text-white hover:bg-[#0056B3]'} transition-colors cursor-pointer`}
                  aria-label="Subscribe"
                >
                  <EnvelopeSimple weight="bold" className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-600'} mt-8 pt-8 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
          &copy; {new Date().getFullYear()} GFS LMS. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
};

export default Homepage; 