import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const notifications = [
  { id: 1, message: "Course approved", time: "2m ago", type: "success" },
  { id: 2, message: "New educator joined", time: "10m ago", type: "info" },
  { id: 3, message: "User blocked", time: "1h ago", type: "warning" },
  { id: 4, message: "Course review pending", time: "2h ago", type: "pending" },
];

const getNotificationColor = (type, isDark) => {
  const colors = {
    success: isDark ? 'text-green-400' : 'text-green-600',
    info: isDark ? 'text-blue-400' : 'text-blue-600',
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    pending: isDark ? 'text-purple-400' : 'text-purple-600',
  };
  return colors[type] || (isDark ? 'text-neutral-400' : 'text-neutral-600');
};

export default function NotificationBell() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-3 rounded-xl transition-all duration-300 ${
          isDark 
            ? 'bg-neutral-800/50 border border-neutral-700/50 text-neutral-300 hover:bg-neutral-700/50' 
            : 'bg-white/50 border border-neutral-200/50 text-neutral-600 hover:bg-neutral-100/50'
        } backdrop-blur-xl shadow-lg hover:shadow-xl ${hasNotifications ? 'shadow-blue-500/10' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <motion.div
          animate={hasNotifications ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: hasNotifications ? Infinity : 0, repeatDelay: 3 }}
        >
          <FaBell className="text-lg" />
        </motion.div>
        {hasNotifications && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white text-xs flex items-center justify-center font-medium shadow-lg shadow-red-500/30"
          >
            {notifications.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-xl z-50 ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700' 
                  : 'bg-white border-neutral-200'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-neutral-700' : 'border-neutral-200'
              }`}>
                <h4 className={`font-semibold text-lg ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Notifications
                </h4>
                <button
                  onClick={() => setOpen(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-neutral-700 text-neutral-400' 
                      : 'hover:bg-neutral-100 text-neutral-500'
                  }`}
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="p-2">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg mb-2 transition-all cursor-pointer border ${
                          isDark 
                            ? 'hover:bg-neutral-700 border-transparent hover:border-neutral-600' 
                            : 'hover:bg-neutral-50 border-transparent hover:border-neutral-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              isDark ? 'text-white' : 'text-neutral-900'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-1 ${getNotificationColor(notification.type, isDark)}`}>
                              {notification.time}
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'info' ? 'bg-blue-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            'bg-purple-500'
                          }`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FaBell className={`w-8 h-8 mx-auto mb-3 ${
                      isDark ? 'text-neutral-600' : 'text-neutral-400'
                    }`} />
                    <p className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}>
                      No new notifications
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className={`p-3 border-t ${
                  isDark ? 'border-neutral-700' : 'border-neutral-200'
                }`}>
                  <button className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark 
                      ? 'text-blue-400 hover:bg-blue-500/10' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}>
                    Mark all as read
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
