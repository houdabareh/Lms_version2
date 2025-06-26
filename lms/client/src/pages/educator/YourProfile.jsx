import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3BottomLeftIcon,
  KeyIcon,
  BellAlertIcon,
  SwatchIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import profileImg from '../../assets/profile_img3.png'; // Using the previously added profile image

const YourProfile = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const recentActivity = [
    'Uploaded "Advanced React Hooks" course',
    'Replied to a student in "JavaScript Basics"',
    'Scheduled a live session for "CSS Masterclass"',
    'Updated course materials for "Node.js Fundamentals"',
    'Graded assignments for "Data Structures"',
  ];

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-br from-primary-light to-blue-200 dark:from-darkBg dark:to-gray-800 rounded-3xl shadow-xl p-8 mb-12 overflow-hidden"
        variants={itemVariants}
      >
        {/* Optional: Background glow/pattern if available */}
        {/* <img src="/assets/bg-glow.svg" alt="background glow" className="absolute inset-0 w-full h-full object-cover opacity-20" /> */}
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <motion.img
            src={profileImg}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
          />
          <div className="flex-grow">
            <motion.h1 
              className="text-4xl font-extrabold text-white dark:text-white mb-2 drop-shadow-md"
              variants={itemVariants}
            >
              John Doe
            </motion.h1>
            <motion.p 
              className="text-xl font-semibold text-blue-100 dark:text-gray-300"
              variants={itemVariants}
            >
              Educator
            </motion.p>
          </div>
          <motion.button
            className="bg-white text-primary dark:bg-gray-700 dark:text-accent px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Edit Profile clicked!')}
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Profile
          </motion.button>
        </div>
      </motion.div>

      {/* Animated Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Account Details Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ translateY: -5, borderColor: '#6366F1' }}
        >
          <div className="flex items-center text-primary dark:text-accent mb-4">
            <UserCircleIcon className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Account Details</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
            Email: john.doe@example.com
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-gray-500" />
            Phone: +1 (555) 123-4567
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <UserCircleIcon className="h-5 w-5 text-gray-500" />
            Role: Educator
          </p>
          <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            Last Login: 2023-10-27 10:30 AM
          </p>
        </motion.div>

        {/* Security Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ translateY: -5, borderColor: '#F59E0B' }}
        >
          <div className="flex items-center text-yellow-500 mb-4">
            <KeyIcon className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span>Password Update</span>
              <button className="text-primary dark:text-accent hover:underline text-sm">Change</button>
            </li>
            <li className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span>Two-Factor Authentication</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </li>
          </ul>
        </motion.div>

        {/* Preferences Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ translateY: -5, borderColor: '#22C55E' }}
        >
          <div className="flex items-center text-green-500 mb-4">
            <Cog6ToothIcon className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span>Theme</span>
              <button className="text-primary dark:text-accent hover:underline text-sm" onClick={() => alert('Theme toggle action')}>Toggle Theme</button>
            </li>
            <li className="flex items-center justify-between text-gray-700 dark:text-gray-300">
              <span>Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </li>
          </ul>
        </motion.div>

        {/* Recent Activity Card - Kept as is, but adjusted styling for consistency */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          variants={itemVariants}
          whileHover={{ translateY: -5, borderColor: '#EF4444' }}
        >
          <div className="flex items-center text-red-500 mb-4">
            <ClockIcon className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <ul className="space-y-3">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <Bars3BottomLeftIcon className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default YourProfile; 