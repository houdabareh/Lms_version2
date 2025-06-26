import React, { useState } from "react";
import { 
  FaTachometerAlt, 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaChevronLeft,
  FaGraduationCap,
  FaBell,
  FaQuestionCircle,
  FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "../../context/NavigationContext";
import logo from "../../assets/logo.png";

const navItems = [
  { 
    label: "Dashboard", 
    icon: FaTachometerAlt, 
    path: "/admin/dashboard",
    badge: null
  },
  { 
    label: "Courses", 
    icon: FaBook, 
    path: "/admin/pending-courses",
    badge: 12
  },
  { 
    label: "Users", 
    icon: FaUsers, 
    path: "/admin/users",
    badge: null
  },
  { 
    label: "Analytics", 
    icon: FaChartBar, 
    path: "/admin/analytics",
    badge: null
  },
  { 
    label: "Settings", 
    icon: FaCog, 
    path: "/admin/settings",
    badge: null
  }
];

const quickActions = [
  { label: "Course Approvals", icon: FaGraduationCap, count: 5 },
  { label: "Notifications", icon: FaBell, count: 3 },
  { label: "Support Tickets", icon: FaQuestionCircle, count: 2 }
];

export default function AdminSidebar({ active = "Dashboard" }) {
  const { isDark } = useTheme();
  const { navigateToPage, isNavigating, nextPage } = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 h-full transition-all duration-500 z-50 ${
        collapsed ? 'w-20' : 'w-72'
      } ${
        isDark 
          ? 'bg-neutral-900/95 border-neutral-800/50' 
          : 'bg-white/95 border-neutral-200/50'
      } backdrop-blur-xl border-r shadow-2xl shadow-black/10 flex flex-col before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-500/5 before:to-purple-500/5 before:pointer-events-none`}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-inherit backdrop-blur-sm">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"></div>
              </motion.div>
              <div>
                <motion.h2 
                  className={`font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                  whileHover={{ scale: 1.02 }}
                >
                  GFS LMS
                </motion.h2>
                <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Admin Portal
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: collapsed ? 180 : 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className={`p-3 rounded-xl transition-all duration-300 ${
            isDark 
              ? 'hover:bg-neutral-800/50 text-neutral-400 hover:text-white' 
              : 'hover:bg-neutral-100/50 text-neutral-500 hover:text-neutral-900'
          } backdrop-blur-sm shadow-lg hover:shadow-xl`}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronLeft className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.label;
            const isNavigatingToThis = isNavigating && nextPage === item.label;
            const isHovered = hoveredItem === item.label;
            
            return (
              <motion.button
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPage(item.label, item.path);
                }}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ x: collapsed ? 0 : 6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
                className={`group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 transform overflow-hidden ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/30'
                      : 'bg-gradient-to-r from-blue-50/90 to-purple-50/90 text-blue-700 border border-blue-200/50 shadow-xl shadow-blue-500/10'
                    : isDark
                    ? 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white hover:shadow-xl hover:shadow-black/20'
                    : 'text-neutral-700 hover:bg-white/60 hover:text-neutral-900 hover:shadow-xl hover:shadow-black/5'
                } ${isNavigatingToThis ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'} ${
                  isHovered && !collapsed ? 'shadow-lg backdrop-blur-xl' : ''
                } backdrop-blur-sm border border-transparent hover:border-neutral-200/30 dark:hover:border-neutral-700/30`}
              >
                <div className="relative flex-shrink-0">
                  {isNavigatingToThis ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaSpinner className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-5 h-5" />
                    </motion.div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute -left-6 top-1/2 w-1.5 h-8 rounded-r-full ${
                          isDark ? 'bg-gradient-to-b from-blue-400 to-purple-400' : 'bg-gradient-to-b from-blue-600 to-purple-600'
                        } shadow-lg`}
                        style={{ transform: 'translateY(-50%)' }}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"
                      />
                    </>
                  )}
                </div>
                
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <motion.span 
                        className="font-medium text-sm whitespace-nowrap"
                        animate={isHovered ? { x: 2 } : { x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                      
                      {item.badge && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className={`px-2 py-0.5 text-xs rounded-full ml-2 font-medium ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : isDark
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      
                      {/* Loading indicator for this item */}
                      {isNavigatingToThis && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-2"
                        >
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 px-3 ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-neutral-800/50 hover:bg-neutral-800' 
                        : 'bg-neutral-50 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className={`w-4 h-4 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-500'
                      }`} />
                      <span className={`text-sm ${
                        isDark ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        {action.label}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isDark 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {action.count}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-inherit">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-lg ${
                isDark ? 'bg-neutral-800' : 'bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-blue-600' : 'bg-blue-100'
                }`}>
                  <span className={`text-sm font-bold ${
                    isDark ? 'text-white' : 'text-blue-700'
                  }`}>
                    AJ
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>
                    Alex Johnson
                  </p>
                  <p className={`text-xs truncate ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    System Administrator
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-600' : 'bg-blue-100'
              }`}>
                <span className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-blue-700'
                }`}>
                  AJ
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
} 