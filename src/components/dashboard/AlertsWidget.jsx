'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertCircle, FiAlertTriangle, FiInfo, FiX, 
  FiCheckCircle, FiBell, FiBellOff
} from 'react-icons/fi';
import Link from 'next/link';

export default function AlertsWidget({ devices }) {
  const [alerts, setAlerts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // Generate alerts based on device metrics
    const newAlerts = [];
    
    devices.forEach(device => {
      // CPU alert
      if (device.cpu > 85) {
        newAlerts.push({
          id: `${device.deviceId}-cpu`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'cpu',
          severity: 'critical',
          title: 'High CPU Usage',
          message: `CPU usage is at ${device.cpu}%`,
          timestamp: new Date(),
          value: device.cpu,
        });
      } else if (device.cpu > 70) {
        newAlerts.push({
          id: `${device.deviceId}-cpu-warning`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'cpu',
          severity: 'warning',
          title: 'High CPU Usage',
          message: `CPU usage is at ${device.cpu}%`,
          timestamp: new Date(),
          value: device.cpu,
        });
      }
      
      // Memory alert
      if (device.memory > 90) {
        newAlerts.push({
          id: `${device.deviceId}-memory`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'memory',
          severity: 'critical',
          title: 'Critical Memory Usage',
          message: `Memory usage is at ${device.memory}%`,
          timestamp: new Date(),
          value: device.memory,
        });
      } else if (device.memory > 80) {
        newAlerts.push({
          id: `${device.deviceId}-memory-warning`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'memory',
          severity: 'warning',
          title: 'High Memory Usage',
          message: `Memory usage is at ${device.memory}%`,
          timestamp: new Date(),
          value: device.memory,
        });
      }
      
      // Battery alert
      if (device.battery?.level < 15) {
        newAlerts.push({
          id: `${device.deviceId}-battery`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'battery',
          severity: 'critical',
          title: 'Critical Battery Level',
          message: `Battery is at ${device.battery.level}%`,
          timestamp: new Date(),
          value: device.battery.level,
        });
      } else if (device.battery?.level < 25) {
        newAlerts.push({
          id: `${device.deviceId}-battery-warning`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'battery',
          severity: 'warning',
          title: 'Low Battery',
          message: `Battery is at ${device.battery.level}%`,
          timestamp: new Date(),
          value: device.battery.level,
        });
      }
      
      // Offline alert
      if (device.status === 'offline') {
        newAlerts.push({
          id: `${device.deviceId}-offline`,
          deviceId: device.deviceId,
          deviceName: device.deviceName,
          type: 'status',
          severity: 'warning',
          title: 'Device Offline',
          message: `${device.deviceName} is offline`,
          timestamp: device.lastSeen,
        });
      }
    });
    
    setAlerts(newAlerts);
  }, [devices]);

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <FiAlertCircle className="text-red-500" size={18} />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" size={18} />;
      default:
        return <FiInfo className="text-blue-500" size={18} />;
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const displayAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiBell className="text-purple-600" size={20} />
            {alerts.length > 0 && !muted && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Active Alerts</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-1 rounded-lg transition ${muted ? 'text-gray-400' : 'text-purple-600'}`}
          >
            {muted ? <FiBellOff size={18} /> : <FiBell size={18} />}
          </button>
          {alerts.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              {showAll ? 'Show Less' : `View All (${alerts.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Alert Summary */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="mb-4 flex gap-3">
          {criticalCount > 0 && (
            <div className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-red-600">Critical</div>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
              <div className="text-xs text-yellow-600">Warning</div>
            </div>
          )}
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {displayAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiCheckCircle className="mx-auto text-2xl mb-2 text-green-500" />
              <p className="text-sm">No active alerts</p>
              <p className="text-xs mt-1">All devices are healthy</p>
            </div>
          ) : (
            displayAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-3 rounded-lg border ${getSeverityBg(alert.severity)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 dark:text-white text-sm">
                          {alert.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {alert.deviceName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {alert.value && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            alert.severity === 'critical' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {alert.value}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <FiX size={14} className="text-gray-500" />
                  </button>
                </div>
                <div className="mt-2">
                  <Link href={`/devices/${alert.deviceId}`}>
                    <button className="text-xs text-purple-600 hover:text-purple-700">
                      View Device →
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {alerts.length > 0 && !muted && (
        <div className="mt-4 pt-3 border-t dark:border-gray-700">
          <button
            onClick={() => {
              // Acknowledge all alerts
              setAlerts([]);
            }}
            className="w-full text-center text-sm text-purple-600 hover:text-purple-700"
          >
            Acknowledge All
          </button>
        </div>
      )}
    </div>
  );
}
