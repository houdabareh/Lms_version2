import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaUsers, FaDollarSign, FaPlus, FaEnvelope, FaChartLine, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import LuxuryStatCard from '../../components/admin/LuxuryStatCard';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useTheme } from '../../context/ThemeContext';

// Stats data
const stats = [
  { 
    label: 'Pending Courses', 
    value: 12, 
    icon: FaBookOpen, 
    change: '+2.3%',
    trend: 'up',
    color: 'blue'
  },
  { 
    label: 'Active Users', 
    value: '1,248', 
    icon: FaUsers, 
    change: '+12.5%',
    trend: 'up',
    color: 'green'
  },
  { 
    label: 'Monthly Revenue', 
    value: '$42,350', 
    icon: FaDollarSign, 
    change: '+8.1%',
    trend: 'up',
    color: 'purple'
  }
];

// Recent activity data
const recentActivity = [
  {
    id: 1,
    type: 'course_submitted',
    title: 'React Masterclass',
    educator: 'Jane Smith',
    time: '2 minutes ago',
    status: 'pending',
    icon: FaBookOpen
  },
  {
    id: 2,
    type: 'user_registered',
    title: 'New user registration',
    educator: 'John Doe joined as Student',
    time: '15 minutes ago',
    status: 'success',
    icon: FaUsers
  },
  {
    id: 3,
    type: 'course_approved',
    title: 'Python Fundamentals',
    educator: 'Sarah Wilson',
    time: '1 hour ago',
    status: 'approved',
    icon: FaCheckCircle
  },
  {
    id: 4,
    type: 'payment_received',
    title: 'Course enrollment payment',
    educator: '$299 from Mike Johnson',
    time: '2 hours ago',
    status: 'success',
    icon: FaDollarSign
  },
  {
    id: 5,
    type: 'issue_reported',
    title: 'Video playback issue',
    educator: 'Reported by Alex Brown',
    time: '3 hours ago',
    status: 'warning',
    icon: FaExclamationTriangle
  }
];

// Quick actions
const quickActions = [
  { label: 'Add New Course', icon: FaBookOpen, color: 'blue', href: '/admin/courses/new' },
  { label: 'Message Educator', icon: FaEnvelope, color: 'green', href: '/admin/messages' },
  { label: 'View Analytics', icon: FaChartLine, color: 'purple', href: '/admin/analytics' },
  { label: 'System Settings', icon: FaClock, color: 'orange', href: '/admin/settings' }
];

// Stats card component
function StatCard({ stat, index }) {
  const { isDark } = useTheme();
  
  const colorClasses = {
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    green: isDark ? 'text-green-400' : 'text-green-600',
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
  };

  const bgClasses = {
    blue: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
    green: isDark ? 'bg-green-500/10' : 'bg-green-50',
    purple: isDark ? 'bg-purple-500/10' : 'bg-purple-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-600' 
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgClasses[stat.color]}`}>
          <stat.icon className={`w-6 h-6 ${colorClasses[stat.color]}`} />
        </div>
        <div className={`flex items-center text-sm ${
          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          <FaChartLine className="w-3 h-3 mr-1" />
          {stat.change}
        </div>
      </div>
      <div>
        <h3 className={`text-2xl font-bold mb-1 ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          {stat.value}
        </h3>
        <p className={`text-sm ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

// Activity item component
function ActivityItem({ activity, index }) {
  const { isDark } = useTheme();
  
  const statusColors = {
    pending: isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50',
    success: isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100/80 text-green-800 border-green-200/50',
    approved: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100/80 text-blue-800 border-blue-200/50',
    warning: isDark ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100/80 text-red-800 border-red-200/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ scale: 1.01, x: 8 }}
      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
      className={`flex items-start gap-6 p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm group cursor-pointer ${
        isDark 
          ? 'hover:bg-neutral-800/50 border-neutral-700/50 hover:border-neutral-600/50 hover:shadow-xl hover:shadow-black/20' 
          : 'hover:bg-white/50 border-neutral-200/50 hover:border-neutral-300/50 hover:shadow-xl hover:shadow-black/5'
      }`}
    >
        <motion.div 
          className={`p-4 rounded-2xl backdrop-blur-sm border shadow-lg ${
            isDark ? 'bg-neutral-800/50 border-neutral-700/50' : 'bg-neutral-100/50 border-neutral-200/50'
          }`}
          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.3 }}
        >
          {activity.icon ? (
            <activity.icon className={`w-5 h-5 ${
              isDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-700'
            } transition-colors`} />
          ) : (
            <FaBookOpen className={`w-5 h-5 ${
              isDark ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-700'
            } transition-colors`} />
          )}
        </motion.div>
      <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className={`font-semibold text-base mb-1 ${
                isDark ? 'text-white group-hover:text-blue-400' : 'text-neutral-900 group-hover:text-blue-600'
              } transition-colors`}>
                {activity.title}
              </h4>
              <p className={`text-sm ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {activity.educator}
              </p>
            </div>
            <motion.span 
              className={`px-3 py-2 text-xs font-medium rounded-xl border backdrop-blur-sm ${statusColors[activity.status]}`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.1 }}
            >
              {activity.status}
            </motion.span>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              {activity.time}
            </p>
            <motion.div
              className={`opacity-0 group-hover:opacity-100 transition-opacity text-sm ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
              initial={false}
              whileHover={{ x: 4 }}
            >
              View details →
            </motion.div>
          </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { isDark } = useTheme();
  const { adminUser, apiCall } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/api/admin/dashboard');
        setDashboardData(data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
        // Fallback to default data if fetch fails
        setDashboardData({
          totalUsers: 0,
          totalCourses: 0,
          totalEnrollments: 0,
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiCall]);

  // Generate stats from real data
  const generateStats = () => {
    if (!dashboardData) return stats; // fallback to default stats
    
    return [
      { 
        label: 'Total Courses', 
        value: dashboardData.totalCourses || 0, 
        icon: FaBookOpen, 
        change: '+2.3%',
        trend: 'up',
        color: 'blue'
      },
      { 
        label: 'Active Users', 
        value: dashboardData.totalUsers || 0, 
        icon: FaUsers, 
        change: '+12.5%',
        trend: 'up',
        color: 'green'
      },
      { 
        label: 'Total Enrollments', 
        value: dashboardData.totalEnrollments || 0, 
        icon: FaDollarSign, 
        change: '+8.1%',
        trend: 'up',
        color: 'purple'
      }
    ];
  };

  const currentStats = generateStats();

  return (
    <AdminProtectedRoute>
      <PageTransition pageName="Dashboard">
      <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <AdminSidebar active="Dashboard" />
        
        {/* Main Content */}
        <div className="flex-1 ml-72 relative z-10">
          <AdminNavbar />
          
          <main className="p-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
              >
                Welcome back, {adminUser?.name || 'Admin'} 👋
              </motion.h1>
              <motion.p 
                className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Here's what's happening with your platform today
              </motion.p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {currentStats.map((stat, index) => (
                <LuxuryStatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>

                      {/* 3-Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Recent Activity - Takes 2 columns */}
              <div className="xl:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, type: "spring", bounce: 0.2 }}
                  className={`backdrop-blur-xl border rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ${
                    isDark 
                      ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                      : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                  }`}
                >
                  {/* Header with gradient */}
                  <div className="relative p-8 border-b border-inherit backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                          Recent Activity
                        </h2>
                        <p className={`text-sm mt-1 ${
                          isDark ? 'text-neutral-400' : 'text-neutral-600'
                        }`}>
                          Latest platform updates and user actions
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-xl backdrop-blur-sm border transition-all ${
                          isDark 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' 
                            : 'bg-blue-50/50 border-blue-200/50 text-blue-600 hover:bg-blue-100/50'
                        } shadow-lg hover:shadow-xl`}
                      >
                        View all
                      </motion.button>
                    </div>
                  </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className={`p-6 rounded-2xl border animate-pulse ${
                          isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                        }`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                            <div className="flex-1">
                              <div className={`h-4 rounded mb-2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                              <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : dashboardData?.recentActivity?.length > 0 ? (
                      dashboardData.recentActivity.map((activity, index) => (
                        <ActivityItem key={activity._id || index} activity={activity} index={index} />
                      ))
                    ) : (
                      recentActivity.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} index={index} />
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring", bounce: 0.2 }}
                className={`backdrop-blur-xl border rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                    : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                }`}
              >
                  <div className="relative p-8 border-b border-inherit backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
                    <div className="relative">
                      <h3 className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
                        Quick Actions
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        Common administrative tasks
                      </p>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="space-y-4">
                      {quickActions.map((action, index) => (
                        <motion.a
                          key={action.label}
                          href={action.href}
                          initial={{ opacity: 0, x: 30, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          whileHover={{ scale: 1.02, x: 8 }}
                          transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                          className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 backdrop-blur-sm group cursor-pointer ${
                            isDark 
                              ? 'hover:bg-neutral-800/60 border-neutral-700/50 hover:border-neutral-600/50 hover:shadow-xl hover:shadow-black/20' 
                              : 'hover:bg-white/60 border-neutral-200/50 hover:border-neutral-300/50 hover:shadow-xl hover:shadow-black/5'
                          }`}
                        >
                          <motion.div 
                            className={`p-4 rounded-2xl backdrop-blur-sm border shadow-lg ${
                              action.color === 'blue' ? (isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50/50 border-blue-200/50') :
                              action.color === 'green' ? (isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50/50 border-green-200/50') :
                              action.color === 'purple' ? (isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50/50 border-purple-200/50') :
                              (isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50/50 border-orange-200/50')
                            }`}
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            <action.icon className={`w-5 h-5 ${
                              action.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                              action.color === 'green' ? (isDark ? 'text-green-400' : 'text-green-600') :
                              action.color === 'purple' ? (isDark ? 'text-purple-400' : 'text-purple-600') :
                              (isDark ? 'text-orange-400' : 'text-orange-600')
                            }`} />
                          </motion.div>
                          <div className="flex-1">
                            <span className={`text-base font-semibold transition-all duration-300 ${
                              isDark ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-700 group-hover:text-neutral-900'
                            }`}>
                              {action.label}
                            </span>
                          </div>
                          <motion.div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`}
                            initial={false}
                            animate={{ x: 0 }}
                            whileHover={{ x: 4 }}
                          >
                            →
                          </motion.div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Performance Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6, type: "spring", bounce: 0.2 }}
                className={`backdrop-blur-xl border rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                    : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                }`}
              >
                  <div className="relative p-8 border-b border-inherit backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5" />
                    <div className="relative">
                      <h3 className={`text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent`}>
                        This Month
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}>
                        Performance overview
                      </p>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="space-y-6">
                      {[
                        { label: 'Course Approvals', value: '24', color: 'blue', progress: 80 },
                        { label: 'New Users', value: '156', color: 'purple', progress: 65 },
                        { label: 'Revenue Growth', value: '+23%', color: 'green', progress: 90 }
                      ].map((item, index) => (
                        <motion.div 
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 + index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${
                              isDark ? 'text-neutral-400' : 'text-neutral-600'
                            }`}>
                              {item.label}
                            </span>
                            <span className={`text-lg font-bold ${
                              item.color === 'green' ? 'text-emerald-500' :
                              item.color === 'blue' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                              item.color === 'purple' ? (isDark ? 'text-purple-400' : 'text-purple-600') :
                              (isDark ? 'text-white' : 'text-neutral-900')
                            }`}>
                              {item.value}
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                item.color === 'green' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                item.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                'bg-gradient-to-r from-purple-400 to-purple-600'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ delay: 1.6 + index * 0.1, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </PageTransition>
    </AdminProtectedRoute>
  );
} 