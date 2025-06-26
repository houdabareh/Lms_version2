import React, { useState } from "react";
import { FaMoon, FaSun, FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from './NotificationBell';

const AdminNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileMenuItems = [
    { icon: FaUser, label: 'My Profile', action: () => console.log('Profile') },
    { icon: FaCog, label: 'Account Settings', action: () => console.log('Settings') },
    { icon: FaSignOutAlt, label: 'Sign Out', action: () => console.log('Sign Out'), danger: true }
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-800/50' 
          : 'bg-white/80 border-neutral-200/50'
      } border-b shadow-lg shadow-black/5`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Search Bar */}
        <motion.div 
          className="flex-1 max-w-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative group">
            <motion.div
              className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' 
                  : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
              } opacity-0 group-focus-within:opacity-100 blur-xl`}
            />
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              } transition-colors group-focus-within:text-blue-500`} />
              <motion.input
                id="admin-global-search"
                name="adminGlobalSearch"
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search users, courses, analytics..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-0 transition-all duration-300 ${
                  isDark 
                    ? 'bg-neutral-800/50 text-white placeholder-neutral-400 focus:bg-neutral-800/80' 
                    : 'bg-neutral-50/50 text-neutral-900 placeholder-neutral-500 focus:bg-white/80'
                } backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/10`}
              />
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'bg-neutral-800/50 hover:bg-neutral-700/50 text-yellow-400' 
                : 'bg-white/50 hover:bg-neutral-100/50 text-neutral-600'
            } backdrop-blur-xl shadow-lg hover:shadow-xl`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <NotificationBell />
          </motion.div>

          {/* Admin Profile Dropdown */}
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-neutral-800/50 hover:bg-neutral-700/50 border-neutral-700/50' 
                  : 'bg-white/50 hover:bg-neutral-50/50 border-neutral-200/50'
              } backdrop-blur-xl border shadow-lg hover:shadow-xl`}
            >
              {/* Avatar with Status */}
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  AJ
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800 shadow-sm"
                />
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left">
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Alex Johnson
                </p>
                <p className={`text-xs ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  System Admin
                </p>
              </div>

              <motion.div
                animate={{ rotate: showProfileDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className={`w-3 h-3 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`} />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl z-20 ${
                      isDark 
                        ? 'bg-neutral-800/95 border-neutral-700/50' 
                        : 'bg-white/95 border-neutral-200/50'
                    } backdrop-blur-xl`}
                  >
                    {/* Profile Header */}
                    <div className={`p-4 border-b ${
                      isDark ? 'border-neutral-700/50' : 'border-neutral-200/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                          AJ
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            isDark ? 'text-white' : 'text-neutral-900'
                          }`}>
                            Alex Johnson
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>
                            alex.johnson@gfs.edu
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {profileMenuItems.map((item, index) => (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            item.action();
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            item.danger 
                              ? isDark
                                ? 'hover:bg-red-500/10 text-red-400' 
                                : 'hover:bg-red-50 text-red-600'
                              : isDark
                              ? 'hover:bg-neutral-700/50 text-neutral-300' 
                              : 'hover:bg-neutral-50 text-neutral-700'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className={`p-4 border-t ${
                      isDark ? 'border-neutral-700/50' : 'border-neutral-200/50'
                    }`}>
                      <p className={`text-xs text-center ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        GFS LMS Admin v2.1.0
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminNavbar;
