'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShield, FiLock, FiUnlock, FiAlertTriangle, FiEye, 
  FiEyeOff, FiKey, FiSmartphone, FiGlobe, FiMail,
  FiActivity, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceSecurity({ device, onUpdate }) {
  const [showLockCode, setShowLockCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securityAction, setSecurityAction] = useState(null);

  const securityMetrics = [
    {
      title: 'Device Status',
      value: device?.status === 'online' ? 'Secure' : 'Offline',
      icon: FiSmartphone,
      status: device?.status === 'online' ? 'good' : 'warning',
    },
    {
      title: 'Lock Status',
      value: device?.lockState?.isLocked ? 'Locked' : 'Unlocked',
      icon: device?.lockState?.isLocked ? FiLock : FiUnlock,
      status: device?.lockState?.isLocked ? 'warning' : 'good',
    },
    {
      title: 'Anti-Uninstall',
      value: device?.antiUninstall?.enabled ? 'Enabled' : 'Disabled',
      icon: FiShield,
      status: device?.antiUninstall?.enabled ? 'good' : 'danger',
    },
    {
      title: 'Security Level',
      value: device?.securityStatus?.isBlocked ? 'Blocked' : 'Normal',
      icon: FiAlertTriangle,
      status: device?.securityStatus?.isBlocked ? 'danger' : 'good',
    },
  ];

  const securityActions = [
    {
      name: 'Lock Device',
      description: 'Lock the device with PIN/password',
      icon: FiLock,
      color: 'purple',
      action: 'LOCK',
    },
    {
      name: 'Enable Anti-Uninstall',
      description: 'Prevent app from being uninstalled',
      icon: FiShield,
      color: 'green',
      action: 'ANTI_UNINSTALL_ON',
    },
    {
      name: 'Disable Anti-Uninstall',
      description: 'Allow app to be uninstalled',
      icon: FiShield,
      color: 'red',
      action: 'ANTI_UNINSTALL_OFF',
    },
    {
      name: 'Clear Data',
      description: 'Clear all app data from device',
      icon: FiActivity,
      color: 'orange',
      action: 'CLEAR_DATA',
    },
    {
      name: 'Block Device',
      description: 'Permanently block this device',
      icon: FiXCircle,
      color: 'red',
      action: 'BLOCK_DEVICE',
    },
  ];

  const handleSecurityAction = async (action) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/devices/${device.deviceId}/security/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        toast.success(`Security action ${action} executed successfully`);
        onUpdate?.();
      } else {
        throw new Error('Action failed');
      }
    } catch (error) {
      toast.error(`Failed to execute ${action}`);
    } finally {
      setLoading(false);
      setSecurityAction(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'danger': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 dark:bg-green-900';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900';
      case 'danger': return 'bg-red-100 dark:bg-red-900';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 ${getStatusBgColor(metric.status)} rounded-lg flex items-center justify-center`}>
                  <Icon className={getStatusColor(metric.status)} size={16} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</span>
              </div>
              <div className={`text-lg font-semibold ${getStatusColor(metric.status)}`}>
                {metric.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiShield /> Security Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityActions.map((action, idx) => {
            const Icon = action.icon;
            const colorClasses = {
              purple: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20 hover:border-purple-400',
              green: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:border-green-400',
              red: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 hover:border-red-400',
              orange: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 hover:border-orange-400',
            };
            const textColors = {
              purple: 'text-purple-700 dark:text-purple-300',
              green: 'text-green-700 dark:text-green-300',
              red: 'text-red-700 dark:text-red-300',
              orange: 'text-orange-700 dark:text-orange-300',
            };
            return (
              <button
                key={idx}
                onClick={() => setSecurityAction(action)}
                disabled={loading}
                className={`p-4 rounded-xl border-2 transition-all ${colorClasses[action.color]} text-left`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={textColors[action.color]} size={20} />
                  <span className={`font-medium ${textColors[action.color]}`}>{action.name}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Device Security Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiActivity /> Security Logs
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {device?.securityLogs?.length > 0 ? (
            device.securityLogs.map((log, idx) => (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {log.type === 'success' ? (
                      <FiCheckCircle className="text-green-500" size={14} />
                    ) : log.type === 'warning' ? (
                      <FiAlertTriangle className="text-yellow-500" size={14} />
                    ) : (
                      <FiXCircle className="text-red-500" size={14} />
                    )}
                    <span className="text-sm font-medium">{log.action}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.description}</p>
                {log.ip && (
                  <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No security logs available
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
          <FiAlertTriangle /> Danger Zone
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to permanently remove this device? This action cannot be undone.')) {
                handleSecurityAction('REMOVE_DEVICE');
              }
            }}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <FiXCircle /> Remove Device Permanently
          </button>
          <button
            onClick={() => {
              if (confirm('This will reset all device settings to default. Continue?')) {
                handleSecurityAction('RESET_DEVICE');
              }
            }}
            className="w-full bg-orange-600 text-white p-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
          >
            <FiActivity /> Reset Device Settings
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {securityAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FiAlertTriangle className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Confirm Action</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to execute <strong>{securityAction.name}</strong>?
              {securityAction.name === 'Remove Device Permanently' && ' This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSecurityAction(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSecurityAction(securityAction.action)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
    }
