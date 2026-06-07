'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, FiRefreshCw, FiChevronRight, 
  FiCpu, FiHardDrive, FiWifi, FiBattery, FiMapPin
} from 'react-icons/fi';
import Link from 'next/link';

export default function RecentActivity({ devices, realtimeUpdates }) {
  const [activities, setActivities] = useState([]);

  // Generate activities from device data
  const getActivityIcon = (type) => {
    switch (type) {
      case 'cpu': return <FiCpu className="text-purple-500" size={14} />;
      case 'memory': return <FiHardDrive className="text-green-500" size={14} />;
      case 'network': return <FiWifi className="text-blue-500" size={14} />;
      case 'battery': return <FiBattery className="text-yellow-500" size={14} />;
      case 'location': return <FiMapPin className="text-red-500" size={14} />;
      default: return <FiActivity className="text-gray-500" size={14} />;
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'cpu':
        return `CPU usage ${activity.value > activity.previous ? 'increased' : 'decreased'} to ${activity.value}%`;
      case 'memory':
        return `Memory usage ${activity.value > activity.previous ? 'increased' to ${activity.value}%` : `decreased to ${activity.value}%`};
      case 'battery':
        return `Battery level changed to ${activity.value}% ${activity.isCharging ? '(Charging)' : '(Discharging)'}`;
      case 'location':
        return `Location updated - Accuracy: ${activity.accuracy}m`;
      case 'status':
        return `Device went ${activity.value}`;
      default:
        return `Device updated`;
    }
  };

  // Combine device updates and realtime updates
  const allActivities = [
    ...realtimeUpdates.map(update => ({
      id: update.id || Date.now(),
      deviceId: update.deviceId,
      deviceName: update.deviceName,
      type: update.type,
      value: update.value,
      previous: update.previous,
      timestamp: update.timestamp || new Date(),
      icon: getActivityIcon(update.type),
      message: getActivityMessage(update),
    })),
    ...devices.slice(0, 10).map(device => ({
      id: device.deviceId,
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      type: 'status',
      value: device.status,
      timestamp: device.lastSeen,
      icon: getActivityIcon('status'),
      message: `Device ${device.status === 'online' ? 'came online' : 'went offline'}`,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiActivity className="text-purple-600" size={20} />
          <h3 className="font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <FiRefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {allActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiActivity className="mx-auto text-2xl mb-2" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          allActivities.map((activity, idx) => (
            <motion.div
              key={activity.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800 dark:text-white text-sm">
                      {activity.deviceName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.message}
                  </p>
                </div>
              </div>
              <Link href={`/devices/${activity.deviceId}`}>
                <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                  <FiChevronRight size={16} className="text-gray-500" />
                </button>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {allActivities.length >= 10 && (
        <div className="mt-4 pt-3 border-t dark:border-gray-700">
          <Link href="/reports">
            <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700">
              View All Activity →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
