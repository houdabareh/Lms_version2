import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import { useTheme } from '../../context/ThemeContext';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const enrollmentsData = [30, 45, 60, 50, 80, 90, 120];
const revenueData = [1200, 1800, 2200, 2000, 2600, 3100, 4200];
const educatorGrowthData = [2, 3, 4, 5, 7, 8, 10];
const pieData = [60, 30, 10];

const timeFilters = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

export default function Analytics() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState('Monthly');

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: { 
        enabled: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1
      },
    },
    elements: {
      line: { tension: 0.4 },
      bar: { borderRadius: 8 },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? '#374151' : '#f3f4f6',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#f3f4f6',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { 
          color: isDark ? '#e5e7eb' : '#374151',
          font: { size: 12 },
          padding: 20
        },
      },
      tooltip: { 
        enabled: true,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1
      },
    },
  };

  return (
    <PageTransition pageName="Analytics">
      <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <AdminSidebar active="Analytics" />
        
        {/* Main Content */}
        <div className="flex-1 ml-72 relative z-10">
          <AdminNavbar />
          
          <main className="p-8">
            {/* Header */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start"
              >
                <div>
                  <motion.h1 
                    className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
                  >
                    Analytics Dashboard
                  </motion.h1>
                  <motion.p 
                    className={`text-lg ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Track platform performance and user engagement
                  </motion.p>
                </div>
                
                {/* Time Filter */}
                <motion.select
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`px-6 py-3 rounded-xl border backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-lg hover:shadow-xl ${
                    isDark 
                      ? 'bg-neutral-800/80 border-neutral-700/50 text-white' 
                      : 'bg-white/80 border-neutral-200/50 text-neutral-900'
                  }`}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  {timeFilters.map(opt => <option key={opt}>{opt}</option>)}
                </motion.select>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Enrollments Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", bounce: 0.2 }}
                className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group ${
                  isDark 
                    ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
                    : 'bg-white/80 border-neutral-200/50 shadow-black/5'
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                      Enrollments Over Time
                    </h2>
                    <p className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Student registration trends
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-sm border border-blue-500/20 bg-blue-500/10">
                    <motion.div 
                      className="w-3 h-3 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Enrollments
                    </span>
                  </div>
                </div>
              <div className="h-64">
                <Line
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Enrollments',
                        data: enrollmentsData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        pointBackgroundColor: '#3b82f6',
                        fill: true,
                        borderWidth: 3,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700' 
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Revenue Growth
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Revenue ($)
                  </span>
                </div>
              </div>
              <div className="h-64">
                <Bar
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Revenue',
                        data: revenueData,
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: '#22c55e',
                        borderWidth: 1,
                        borderRadius: 8,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Educator Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700' 
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Educator Growth
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    New Educators
                  </span>
                </div>
              </div>
              <div className="h-64">
                <Line
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Educators',
                        data: educatorGrowthData,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        pointBackgroundColor: '#8b5cf6',
                        fill: true,
                        borderWidth: 3,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </motion.div>

            {/* User Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700' 
                  : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  User Distribution
                </h2>
              </div>
              <div className="h-64">
                <Pie
                  data={{
                    labels: ['Students', 'Educators', 'Admins'],
                    datasets: [
                      {
                        data: pieData,
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(139, 92, 246, 0.8)',
                          'rgba(251, 191, 36, 0.8)',
                        ],
                        borderColor: [
                          '#3b82f6',
                          '#8b5cf6',
                          '#fbbf24',
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={pieOptions}
                />
              </div>
            </motion.div>
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 p-6 rounded-xl border ${
              isDark 
                ? 'bg-neutral-800 border-neutral-700' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Summary Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  1,248
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Total Users
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  $42.3K
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Monthly Revenue
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  156
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Active Courses
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  92%
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Completion Rate
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
    </PageTransition>
  );
}
