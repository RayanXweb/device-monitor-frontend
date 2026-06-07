'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiMonitor, FiBarChart2, FiSettings, FiAlertCircle,
  FiActivity, FiCpu, FiHardDrive, FiUsers, FiShield,
  FiMapPin, FiMessageSquare, FiCamera, FiKey
} from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', icon: FiHome, href: '/dashboard' },
  { name: 'Devices', icon: FiMonitor, href: '/devices' },
  { name: 'Connect Device', icon: FiActivity, href: '/connect' },
  { name: 'Reports', icon: FiBarChart2, href: '/reports' },
  { name: 'Alerts', icon: FiAlertCircle, href: '/alerts' },
  { name: 'Settings', icon: FiSettings, href: '/settings' },
];

const quickStats = [
  { label: 'Online Devices', value: '0', icon: FiActivity, color: 'green' },
  { label: 'Active Alerts', value: '0', icon: FiAlertCircle, color: 'red' },
  { label: 'Avg CPU', value: '0%', icon: FiCpu, color: 'blue' },
  { label: 'Avg Memory', value: '0%', icon: FiHardDrive, color: 'purple' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <FiActivity className="text-white" size={16} />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Device Monitor
              </span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2">
              {quickStats.map((stat, idx) => {
                const Icon = stat.icon;
                const colorClasses = {
                  green: 'bg-green-100 dark:bg-green-900 text-green-600',
                  red: 'bg-red-100 dark:bg-red-900 text-red-600',
                  blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600',
                  purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600',
                };
                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${colorClasses[stat.color]} flex items-center justify-center`}>
                        <Icon size={12} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="text-xs text-center text-gray-500">
              <p>Version 3.0.0</p>
              <p className="mt-1">© 2024 Device Monitor</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
