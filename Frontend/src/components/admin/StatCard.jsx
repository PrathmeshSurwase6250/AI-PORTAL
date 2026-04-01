import React from 'react';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon, colorClass, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out ${colorClass}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${colorClass}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-sm font-semibold tracking-wide uppercase mb-1">{title}</span>
          <h3 className="text-3xl font-heading font-extrabold text-gray-900 tracking-tight">{value}</h3>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-sm">
        <span className="flex items-center gap-1 font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
          +12%
        </span>
        <span className="text-gray-400 font-medium">from last month</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
