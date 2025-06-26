import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BookOpenIcon,
  StarIcon,
  CurrencyDollarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '../../context/ThemeContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, FunnelChart, Funnel, LabelList, Cell,
} from 'recharts';

const Analytics = () => {
  const { theme } = useContext(ThemeContext);
  const [activeFilter, setActiveFilter] = useState('This Month');

  // Simulated Data for KPIs
  const [kpis, setKpis] = useState({
    totalStudents: 1234,
    totalCourses: 56,
    avgRating: 4.7,
    totalEarnings: 12500, // Monthly earnings
  });

  // Simulated Data for Charts
  const [engagementData, setEngagementData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    const fetchAnalyticsData = () => {
      // KPI data (already static for now)

      // Engagement Data
      const engagement = [
        { name: 'Week 1', 'Course Views': 4000, 'Completions': 2400 },
        { name: 'Week 2', 'Course Views': 3000, 'Completions': 1398 },
        { name: 'Week 3', 'Course Views': 2000, 'Completions': 9800 },
        { name: 'Week 4', 'Course Views': 2780, 'Completions': 3908 },
        { name: 'Week 5', 'Course Views': 1890, 'Completions': 4800 },
        { name: 'Week 6', 'Course Views': 2390, 'Completions': 3800 },
        { name: 'Week 7', 'Course Views': 3490, 'Completions': 4300 },
      ];
      setEngagementData(engagement);

      // Enrollment Data (simulated funnel or stacked bar)
      const enrollment = [
        { name: 'Visited', value: 5000 },
        { name: 'Registered', value: 3500 },
        { name: 'Enrolled', value: 1500 },
        { name: 'Completed', value: 1000 },
      ];
      setEnrollmentData(enrollment);

      // Revenue Trend Data
      const revenue = [
        { name: 'Jan', 'Revenue': 4000 },
        { name: 'Feb', 'Revenue': 3000 },
        { name: 'Mar', 'Revenue': 5000 },
        { name: 'Apr', 'Revenue': 4500 },
        { name: 'May', 'Revenue': 6000 },
        { name: 'Jun', 'Revenue': 5500 },
      ];
      setRevenueTrendData(revenue);

      // Recent Activity
      const activity = [
        { id: 1, avatar: 'https://i.pravatar.cc/40?img=1', name: 'Jane Doe', action: 'enrolled in', course: 'React Mastery', timestamp: '2 mins ago' },
        { id: 2, avatar: 'https://i.pravatar.cc/40?img=2', name: 'John Smith', action: 'completed', course: 'Advanced CSS', timestamp: '1 hour ago' },
        { id: 3, avatar: 'https://i.pravatar.cc/40?img=3', name: 'Alice Brown', action: 'viewed', course: 'JavaScript Basics', timestamp: '3 hours ago' },
        { id: 4, avatar: 'https://i.pravatar.cc/40?img=4', name: 'Bob White', action: 'enrolled in', course: 'Node.js Fundamentals', timestamp: 'yesterday' },
        { id: 5, avatar: 'https://i.pravatar.cc/40?img=5', name: 'Charlie Green', action: 'completed', course: 'Python for Data Science', timestamp: '2 days ago' },
      ];
      setRecentActivity(activity);

      // Top Performing Courses
      const courses = [
        { id: 1, title: 'React Mastery', enrollments: 350, avgRating: 4.9, revenue: 8500 },
        { id: 2, title: 'Advanced CSS', enrollments: 280, avgRating: 4.7, revenue: 6200 },
        { id: 3, title: 'JavaScript Basics', enrollments: 500, avgRating: 4.5, revenue: 9800 },
        { id: 4, title: 'Node.js Fundamentals', enrollments: 200, avgRating: 4.8, revenue: 5000 },
        { id: 5, title: 'Python for Data Science', enrollments: 180, avgRating: 4.6, revenue: 4500 },
      ];
      setTopCourses(courses);
    };

    fetchAnalyticsData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const chartContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Funnel chart colors
  const funnelColors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']; // Green to Yellow

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color }}>
              {`${p.name}: `}
              <span className="font-semibold">
                {p.name === 'Revenue' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex-1 p-6 ${theme === 'dark' ? 'bg-darkBg' : 'bg-gray-50'} transition-colors duration-200`}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Educator Analytics Dashboard</h1>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg hover:scale-105 transition-all duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{kpis.totalStudents.toLocaleString()}</p>
          </div>
          <UsersIcon className="h-10 w-10 text-primary-light dark:text-accent-light" />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg hover:scale-105 transition-all duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{kpis.totalCourses}</p>
          </div>
          <BookOpenIcon className="h-10 w-10 text-blue-500 dark:text-blue-400" />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg hover:scale-105 transition-all duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{kpis.avgRating}</p>
          </div>
          <StarIcon className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg hover:scale-105 transition-all duration-300"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings (Monthly)</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-1">${kpis.totalEarnings.toLocaleString()}</p>
          </div>
          <CurrencyDollarIcon className="h-10 w-10 text-green-500 dark:text-green-400" />
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Student Engagement</h2>
            <div className="flex space-x-2">
              {['This Month', 'Last 6 Months', 'All Time'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
              <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }} />
              <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="Course Views" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="Completions" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Enrollment Flow</h2>
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                dataKey="value"
                data={enrollmentData}
                isAnimationActive
              >
                <LabelList position="right" fill={theme === 'dark' ? '#D1D5DB' : '#6B7280'} dataKey="name" />
                {
                  enrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                  ))
                }
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 col-span-1 lg:col-span-2"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
              <XAxis dataKey="name" tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }} />
              <YAxis tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity & Top Performing Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <img src={activity.avatar} alt={activity.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{activity.name}</span> {activity.action} <span className="font-medium italic">"{activity.course}"</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
          variants={chartContainerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Top Performing Courses</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                Most Rated
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                Most Revenue
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avg. Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {topCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.enrollments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.avgRating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${course.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> Export CSV
            </button>
            <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200">
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" /> Download Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 