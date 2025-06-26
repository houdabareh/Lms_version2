import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaArrowDown } from 'react-icons/fa';

const LuxuryStatCard = ({ stat, index }) => {
  const colorClasses = {
    blue: {
      text: 'text-blue-500',
      bg: 'bg-blue-500/10',
      gradient: 'from-blue-500/20 to-blue-600/30',
      shadow: 'shadow-blue-500/20',
      border: 'border-blue-500/20',
    },
    green: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      gradient: 'from-emerald-500/20 to-emerald-600/30',
      shadow: 'shadow-emerald-500/20',
      border: 'border-emerald-500/20',
    },
    purple: {
      text: 'text-purple-500',
      bg: 'bg-purple-500/10',
      gradient: 'from-purple-500/20 to-purple-600/30',
      shadow: 'shadow-purple-500/20',
      border: 'border-purple-500/20',
    },
    orange: {
      text: 'text-orange-500',
      bg: 'bg-orange-500/10',
      gradient: 'from-orange-500/20 to-orange-600/30',
      shadow: 'shadow-orange-500/20',
      border: 'border-orange-500/20',
    },
  };

  const colors = colorClasses[stat.color] || colorClasses.blue;
  const isPositive = stat.trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        rotateX: 2,
      }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        bounce: 0.3
      }}
      className="group relative"
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main card */}
      <div className={`relative backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 rounded-3xl border border-white/20 dark:border-neutral-800/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:${colors.shadow} overflow-hidden`}>
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon */}
            <motion.div 
              className={`p-4 rounded-2xl ${colors.bg} backdrop-blur-sm border ${colors.border} shadow-lg`}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 0.3 }}
            >
              <stat.icon className={`w-8 h-8 ${colors.text}`} />
            </motion.div>

            {/* Trend indicator */}
            <motion.div 
              className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm ${
                isPositive 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
              } shadow-lg`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <motion.div
                animate={isPositive ? { y: [-2, 2, -2] } : { y: [2, -2, 2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                                 {isPositive ? (
                   <FaChartLine className="w-4 h-4" />
                 ) : (
                   <FaArrowDown className="w-4 h-4" />
                 )}
              </motion.div>
              <span className="text-sm font-bold">{stat.change}</span>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <motion.h3 
              className="text-4xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", bounce: 0.5 }}
            >
              {stat.value}
            </motion.h3>
            
            <motion.p 
              className="text-lg font-medium text-neutral-600 dark:text-neutral-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {stat.label}
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-2 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(parseInt(stat.change)), 100)}%` }}
                transition={{ 
                  delay: index * 0.1 + 0.6,
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            className={`absolute top-4 right-4 w-3 h-3 ${colors.bg} rounded-full opacity-60`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
          
          <motion.div
            className={`absolute bottom-6 left-6 w-2 h-2 ${colors.bg} rounded-full opacity-40`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3 + 1,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LuxuryStatCard; 