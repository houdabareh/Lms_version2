import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ChalkboardTeacher, BookOpen, Handshake, LightbulbFilament, Sparkle } from '@phosphor-icons/react';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  const { theme } = useContext(ThemeContext);
  const [learnerCount, setLearnerCount] = useState(0);
  const [educatorCount, setEducatorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    const animateCounter = (setter, target, duration) => {
      let start = 0;
      const increment = target / (duration / 50);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.ceil(start));
        }
      }, 50);
    };

    animateCounter(setLearnerCount, 10000, 2000);
    animateCounter(setEducatorCount, 500, 2500);
    animateCounter(setCourseCount, 200, 3000);
  }, []);

  const testimonials = [
    { id: 1, quote: "GFS has been a game-changer for my learning journey. The personalized paths and engaging content kept me motivated and helped me achieve my career goals faster!", name: "Alice Wonderland", role: "Student" },
    { id: 2, quote: "As an educator, the platform provides intuitive tools for course creation and student management. The support team is incredibly responsive and helpful. Highly recommended!", name: "Prof. Charles Xavier", role: "Educator" },
    { id: 3, quote: "The quality of courses and the expertise of instructors on GFS are unmatched. It's truly a global learning community that fosters growth and innovation.", name: "Bob The Builder", role: "Student" },
  ];

  const missionVisionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      <main className="pt-20">
        <section className={`py-20 md:py-32 px-4 text-center ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
          <div className="container mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-white"
            >
              Learn Without Limits. Grow Without Bounds.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Your Global Gateway to Flexible, Certified, and Future-Ready Education.
            </motion.p>
          </div>
        </section>

        <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={missionVisionVariants}
              className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}
            >
              <Users className="h-16 w-16 text-primary mb-4" weight="fill" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                To democratize high-quality education by providing an accessible, innovative, and personalized learning platform that empowers individuals to achieve their full potential and adapt to the evolving demands of the global workforce.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={missionVisionVariants}
              className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'}`}
            >
              <LightbulbFilament className="h-16 w-16 text-green-500 mb-4" weight="fill" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                To be the leading global learning management system, recognized for its commitment to educational excellence, technological innovation, and fostering a diverse and inclusive community of lifelong learners and impactful educators.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={`py-16 px-4 text-center ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
          <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">Our Impact in Numbers</h2>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" weight="fill" />
              <p className="text-5xl font-extrabold text-primary mb-2">{learnerCount}+</p>
              <p className="text-xl text-gray-700 dark:text-gray-300">Learners Worldwide</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <ChalkboardTeacher className="h-12 w-12 text-green-500 mx-auto mb-4" weight="fill" />
              <p className="text-5xl font-extrabold text-green-500 mb-2">{educatorCount}+</p>
              <p className="text-xl text-gray-700 dark:text-gray-300">Expert Educators</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-4" weight="fill" />
              <p className="text-5xl font-extrabold text-purple-500 mb-2">{courseCount}+</p>
              <p className="text-xl text-gray-700 dark:text-gray-300">Diverse Courses</p>
            </motion.div>
          </div>
        </section>

        <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">What Our Community Says</h2>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:scale-105`}
              >
                <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={`py-20 text-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Join Our Growing Community!</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Whether you're a student eager to learn or an educator ready to share your knowledge, GFS is the place for you.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:from-primary-dark hover:to-accent-dark transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today <ArrowLongRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
