'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiCpu, FiHardDrive, FiActivity, FiTrash2, FiEye, 
  FiWifi, FiBattery, FiSignal, FiMoreVertical
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceCard({ device, onDelete, onCommand }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  const getCPUColor = (cpu) => {
    if (cpu < 50) return 'text-green-600';
    if (cpu < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (memory) => {
    if (memory < 60) return 'text-green-600';
    if (memory < 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleQuickCommand = (command) => {
    onCommand(device.deviceId, command, {});
    toast.success(`${command} sent to ${device.deviceName}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all relative"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FiMoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 border dark:border-gray-700">
              <button
                onClick={() => handleQuickCommand('REFRESH')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Refresh Device
              </button>
              <button
                onClick={() => handleQuickCommand('LOCK')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Lock Device
              </button>
              <button
                onClick={() => handleQuickCommand('LOCATION')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Get Location
              </button>
              <hr className="my-1 dark:border-gray-700" />
              <button
                onClick={() => onDelete(device.deviceId)}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                Remove Device
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/devices/${device.deviceId}`}>
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg hover:text-purple-600 transition">
                {device.deviceName || 'Unknown Device'}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
              {device.deviceId?.slice(0, 12)}...
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${getStatusColor(device.status)} rounded-full animate-pulse`}></div>
            <span className={`text-xs font-medium ${
              device.status === 'online' ? 'text-green-600' : 'text-red-600'
            }`}>
              {device.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiWifi size={12} />
            <span>{device.network || 'WiFi'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiBattery size={12} className={getBatteryColor(device.battery?.level)} />
            <span className={getBatteryColor(device.battery?.level)}>{device.battery?.level || 0}%</span>
          </div>
          <div className="flex items-center gap-1">
            <FiSignal size={12} />
            <span>{device.signalInfo?.level || 0}%</span>
          </div>
        </div>

        {/* System Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCpu className="text-gray-400" size={14} />
              <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    device.cpu < 50 ? 'bg-green-500' : device.cpu < 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${device.cpu || 0}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getCPUColor(device.cpu)}`}>
                {device.cpu || 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiHardDrive className="text-gray-400" size={14} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    device.memory < 60 ? 'bg-green-500' : device.memory < 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${device.memory || 0}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getMemoryColor(device.memory)}`}>
                {device.memory || 0}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiActivity className="text-gray-400" size={14} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
            </div>
            <span className="text-sm text-gray-800 dark:text-gray-200">{device.platform || 'N/A'}</span>
          </div>
        </div>

        {/* Last Seen */}
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Last seen: {new Date(device.lastSeen).toLocaleString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/devices/${device.deviceId}`} className="flex-1">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm">
              <FiEye size={14} />
              <span>View</span>
            </button>
          </Link>
          <button
            onClick={() => onDelete(device.deviceId)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <FiTrash2 size={14} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
