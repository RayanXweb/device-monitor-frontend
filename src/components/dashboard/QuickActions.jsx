'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiRefreshCw, FiDownload, FiPlus, FiSettings, 
  FiBell, FiShield, FiActivity, FiUsers, FiMail,
  FiAlertCircle, FiCpu, FiHardDrive, FiWifi
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

const actions = [
  {
    name: 'Connect Device',
    icon: FiPlus,
    href: '/connect',
    color: 'purple',
    description: 'Add new device to monitor',
  },
  {
    name: 'Export Data',
    icon: FiDownload,
    color: 'green',
    description: 'Export all device data',
    onClick: () => {
      toast.success('Export started');
    },
  },
  {
    name: 'Refresh All',
    icon: FiRefreshCw,
    color: 'blue',
    description: 'Refresh all devices',
    onClick: () => {
      window.location.reload();
    },
  },
  {
    name: 'System Health',
    icon: FiActivity,
    href: '/health',
    color: 'teal',
    description: 'Check system status',
  },
  {
    name: 'Bulk Command',
    icon: FiUsers,
    color: 'orange',
    description: 'Send to all devices',
    onClick: () => {
      toast.info('Bulk command feature coming soon');
    },
  },
  {
    name: 'Settings',
    icon: FiSettings,
    href: '/settings',
    color: 'gray',
    description: 'Configure preferences',
  },
];

const colorClasses = {
  purple: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:border-purple-400',
  green: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:border-green-400',
  blue: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-400',
  teal: 'bg-teal-100 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 hover:border-teal-400',
  orange: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:border-orange-400',
  gray: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-400',
};

const iconColors = {
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  teal: 'text-teal-600 dark:text-teal-400',
  orange: 'text-orange-600 dark:text-orange-400',
  gray: 'text-gray-600 dark:text-gray-400',
};

export default function QuickActions() {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    if (action.onClick) {
      setLoading(true);
      try {
        await action.onClick();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiZap className="text-purple-600" /> Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          const isLink = action.href;
          const content = (
            <div className={`p-4 rounded-xl border-2 transition-all ${colorClasses[action.color]} text-center group`}>
              <Icon className={`mx-auto mb-2 ${iconColors[action.color]} group-hover:scale-110 transition-transform`} size={24} />
              <div className="font-medium text-gray-800 dark:text-white text-sm">{action.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</div>
            </div>
          );

          if (isLink) {
            return (
              <Link key={idx} href={action.href}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => handleAction(action)}
              disabled={loading}
              className="w-full"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
  }
