'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loading...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we load your data</p>
      </motion.div>
    </div>
  );
}
