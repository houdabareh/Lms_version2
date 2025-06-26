import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const InteractiveChart = ({ title, data, type = 'line', height = 300 }) => {
  const { isDark } = useTheme();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Simple canvas-based chart implementation
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height);

    // Chart colors based on theme
    const colors = {
      line: isDark ? '#60A5FA' : '#3B82F6', // blue
      gradient: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      text: isDark ? '#D1D5DB' : '#374151',
      grid: isDark ? '#374151' : '#E5E7EB',
    };

    // Chart dimensions
    const padding = 50;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (chartWidth / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }

    // Reset line dash
    ctx.setLineDash([]);

    if (type === 'line' && data.length > 0) {
      // Draw line chart
      const maxValue = Math.max(...data.map(d => d.value));
      const minValue = Math.min(...data.map(d => d.value));
      const valueRange = maxValue - minValue || 1;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, colors.gradient);
      gradient.addColorStop(1, 'transparent');

      // Draw area under curve
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(padding, height - padding);

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(rect.width - padding, height - padding);
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
        
        ctx.fillStyle = colors.line;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Add white border to points
        ctx.strokeStyle = isDark ? '#1F2937' : '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw labels
      ctx.fillStyle = colors.text;
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        ctx.fillText(point.label, x, height - 20);
      });
    }

  }, [data, type, height, isDark]);

  const formatValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-800/50 shadow-black/20' 
          : 'bg-white/80 border-neutral-200/50 shadow-black/5'
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Range: {formatValue(minValue)} - {formatValue(maxValue)}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
            isDark 
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
              : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}>
            Last 7 days
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <canvas
          ref={chartRef}
          className="w-full rounded-xl"
          style={{ height: `${height}px` }}
        />
        
        {/* Hover overlay for interactivity */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
      </div>

      {/* Chart Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className={`text-center p-3 rounded-xl ${
          isDark ? 'bg-neutral-800/50' : 'bg-neutral-50/50'
        }`}>
          <div className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Highest
          </div>
          <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            {formatValue(maxValue)}
          </div>
        </div>
        <div className={`text-center p-3 rounded-xl ${
          isDark ? 'bg-neutral-800/50' : 'bg-neutral-50/50'
        }`}>
          <div className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Average
          </div>
          <div className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {data.length > 0 ? formatValue(Math.round(data.reduce((acc, d) => acc + d.value, 0) / data.length)) : '0'}
          </div>
        </div>
        <div className={`text-center p-3 rounded-xl ${
          isDark ? 'bg-neutral-800/50' : 'bg-neutral-50/50'
        }`}>
          <div className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Lowest
          </div>
          <div className={`text-lg font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {formatValue(minValue)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveChart; 