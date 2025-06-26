import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaEye, FaEnvelope, FaBan, FaUserShield, FaGraduationCap, FaUser, FaPlus } from 'react-icons/fa';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/admin/PageTransition';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import useAdminAuth from '../../hooks/useAdminAuth';
import { useTheme } from '../../context/ThemeContext';

const sampleUsers = [
  { id: 1, name: 'Jane Smith', email: 'jane@example.com', role: 'Educator', status: 'Active', joined: '2023-11-10', courses: 5, students: 124 },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', joined: '2024-01-22', courses: 12, students: 0 },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Educator', status: 'Active', joined: '2024-03-05', courses: 3, students: 89 },
  { id: 4, name: 'Bob Wilson', email: 'bob@example.com', role: 'Student', status: 'Inactive', joined: '2024-02-14', courses: 8, students: 0 },
  { id: 5, name: 'Sarah Lee', email: 'sarah@example.com', role: 'Admin', status: 'Active', joined: '2023-08-12', courses: 0, students: 0 },
  { id: 6, name: 'Mike Brown', email: 'mike@example.com', role: 'Student', status: 'Active', joined: '2024-04-20', courses: 6, students: 0 },
];

const getRoleIcon = (role) => {
  switch (role) {
    case 'Admin': return FaUserShield;
    case 'Educator': return FaGraduationCap;
    default: return FaUser;
  }
};

const getRoleColor = (role, isDark) => {
  switch (role) {
    case 'Admin': 
      return isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800';
    case 'Educator':
      return isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800';
    default:
      return isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800';
  }
};

const getStatusColor = (status, isDark) => {
  switch (status) {
    case 'Active':
      return isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800';
    default:
      return isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800';
  }
};

const UserCard = ({ user, index }) => {
  const { isDark } = useTheme();
  const RoleIcon = getRoleIcon(user.role);
  const userId = user.id || user._id || `user-${index}`;

  return (
    <motion.div
      key={`user-card-${userId}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-600' 
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* User Avatar & Basic Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isDark ? 'bg-neutral-700' : 'bg-neutral-100'
        }`}>
          <RoleIcon className={`w-5 h-5 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {user.name}
          </h3>
          <p className={`truncate max-w-[200px] text-sm ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`} title={user.email}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Role & Status Badges */}
      <div className="flex gap-2 mb-4">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role, isDark)}`}>
          {user.role}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status, isDark)}`}>
          {user.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-xs ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            {user.role === 'Educator' ? 'Courses' : 'Enrolled'}
          </p>
          <p className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {user.courses}
          </p>
        </div>
        {user.role === 'Educator' && (
          <div>
            <p className={`text-xs ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              Students
            </p>
            <p className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {user.students}
            </p>
          </div>
        )}
      </div>

      {/* Join Date */}
      <p className={`text-xs mb-4 ${
        isDark ? 'text-neutral-500' : 'text-neutral-500'
      }`}>
        Joined {user.joined}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <motion.button
          key={`view-${userId}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium ${
            isDark 
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          <FaEye className="w-3 h-3 mx-auto" />
        </motion.button>
        <motion.button
          key={`email-${userId}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium ${
            isDark 
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          <FaEnvelope className="w-3 h-3 mx-auto" />
        </motion.button>
        <motion.button
          key={`ban-${userId}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 p-2 rounded-lg transition-all text-sm font-medium ${
            isDark 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
        >
          <FaBan className="w-3 h-3 mx-auto" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function ManageUsers() {
  const { isDark } = useTheme();
  const { apiCall } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/api/admin/users');
        setUsers(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err.message);
        setUsers(sampleUsers); // Fallback to sample data
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run only once

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminProtectedRoute>
      <PageTransition pageName="Users">
      <div className={`min-h-screen flex transition-colors duration-300 ${
        isDark ? 'bg-neutral-900' : 'bg-neutral-50'
      }`}>
      <AdminSidebar active="Users" />
      
      {/* Main Content */}
      <div className="flex-1 ml-72">
        <AdminNavbar />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              key="manage-users-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-start"
            >
              <div>
                <h1 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Manage Users
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  View and manage all platform users
                </p>
              </div>
              <motion.button
                key="add-user-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium"
              >
                <FaPlus className="w-3 h-3" />
                Add User
              </motion.button>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            key="search-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl border p-6 mb-6 ${
              isDark 
                ? 'bg-neutral-800 border-neutral-700' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`} />
                <input
                  id="user-search"
                  name="userSearch"
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2.5 w-full rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-600 text-white placeholder-neutral-400' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-500'
                  }`}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  id="role-filter"
                  name="roleFilter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    isDark 
                      ? 'bg-neutral-900 border-neutral-600 text-white' 
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                  }`}
                >
                  <option key="all-roles" value="All">All Roles</option>
                  <option key="student" value="Student">Student</option>
                  <option key="educator" value="Educator">Educator</option>
                  <option key="admin" value="Admin">Admin</option>
                </select>

                <button className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 ${
                  isDark 
                    ? 'bg-neutral-900 border-neutral-600 text-white hover:bg-neutral-800' 
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 hover:bg-neutral-100'
                }`}>
                  <FaFilter className="w-3 h-3" />
                  Filter
                </button>
              </div>
            </div>
          </motion.div>

          {/* Users Grid */}
          <motion.div
            key="users-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={`p-6 rounded-xl border animate-pulse ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                    <div className="flex-1">
                      <div className={`h-4 rounded mb-2 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                      <div className={`h-3 rounded w-3/4 ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-red-500 mb-2">Failed to load users</p>
                  <p className="text-sm text-neutral-500">{error}</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full flex items-center justify-center p-8">
                <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>No users found</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <UserCard key={user.id || user._id || `user-${index}`} user={user} index={index} />
              ))
            )}
          </motion.div>

          {/* Pagination */}
          <motion.div
            key="pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-8 p-4 rounded-xl border flex items-center justify-between ${
              isDark 
                ? 'bg-neutral-800 border-neutral-700' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <p className={`text-sm ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Showing 1 to 6 of 24 users
            </p>
            <div className="flex gap-2">
              <button 
                key="prev-btn"
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  isDark 
                    ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Previous
              </button>
              <button 
                key="page-1"
                className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white"
              >
                1
              </button>
              <button 
                key="page-2"
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  isDark 
                    ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                2
              </button>
              <button 
                key="next-btn"
                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                  isDark 
                    ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
    </PageTransition>
    </AdminProtectedRoute>
  );
} 