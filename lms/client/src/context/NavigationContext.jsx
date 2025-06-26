import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [nextPage, setNextPage] = useState(null);

  const navigateToPage = async (pageName, path) => {
    if (pageName === currentPage) return;

    setIsNavigating(true);
    setNextPage(pageName);

    // Simulate smooth transition delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Navigate to the new page
    window.location.href = path;
  };

  const setActivePage = (pageName) => {
    setCurrentPage(pageName);
    setIsNavigating(false);
    setNextPage(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        currentPage,
        nextPage,
        navigateToPage,
        setActivePage
      }}
    >
      {children}
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Modern Loading Spinner */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full"
                />
              </div>
              
              {/* Loading Text */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Loading {nextPage}...
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Please wait while we prepare your content
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-32 h-1 bg-blue-600 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NavigationContext.Provider>
  );
}; 