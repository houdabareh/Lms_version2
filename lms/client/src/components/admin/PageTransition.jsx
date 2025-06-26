import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../context/NavigationContext';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const containerVariants = {
  initial: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)"
  },
  in: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)"
  }
};

export default function PageTransition({ children, pageName }) {
  const { setActivePage } = useNavigation();

  useEffect(() => {
    setActivePage(pageName);
  }, [pageName, setActivePage]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={containerVariants}
      transition={pageTransition}
      className="min-h-screen"
    >
      <motion.div
        variants={pageVariants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
} 