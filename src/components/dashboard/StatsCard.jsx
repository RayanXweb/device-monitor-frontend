'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatsCard({ title, value, icon: Icon, color = 'purple', change }) {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${colors[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
        
        {change && (
          <div className="mt-4 flex items-center gap-1">
            {change.trend === 'up' ? (
              <FiTrendingUp className="text-green-500" size={16} />
            ) : (
              <FiTrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm font-medium ${change.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change.value}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">vs last hour</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
