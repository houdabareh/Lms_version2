import React from "react";
import { motion } from "framer-motion";

export default function StatCard3D({ value, label, icon: Icon, gradient = "from-blue-500 via-purple-500 to-yellow-400" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.07, boxShadow: "0 12px 40px 0 rgba(31,38,135,0.25), 0 2px 8px 0 rgba(251,191,36,0.18)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-6 md:p-7 rounded-3xl shadow-3xl bg-gradient-to-br ${gradient} text-white stat-card-3d cursor-pointer select-none`}
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(31,38,135,0.18), 0 2px 8px 0 rgba(251,191,36,0.12), 0 0 24px 4px rgba(59,130,246,0.12) inset",
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      <div className="mb-2 md:mb-4 w-14 h-14 flex items-center justify-center">
        {Icon && (
          <Icon className="text-4xl text-white drop-shadow-lg" />
        )}
      </div>
      <div className="text-3xl md:text-4xl font-extrabold mb-1 md:mb-2 drop-shadow-lg">{value}</div>
      <div className="text-base md:text-lg font-semibold tracking-wide drop-shadow-md text-white/90">{label}</div>
    </motion.div>
  );
}
