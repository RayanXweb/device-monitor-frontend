'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCpu, FiHardDrive, FiBattery, FiWifi, FiSignal, 
  FiClock, FiInfo, FiSmartphone, FiEdit2, FiSave,
  FiActivity, FiThermometer, FiZap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceProfile({ device, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(device?.deviceName || '');
  const [editedGroup, setEditedGroup] = useState(device?.group || '');

  const handleSave = async () => {
    try {
      // API call to update device
      const response = await fetch(`/api/devices/${device.deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceName: editedName, group: editedGroup })
      });
      if (response.ok) {
        toast.success('Device updated successfully');
        setIsEditing(false);
        onUpdate?.();
      }
    } catch (error) {
      toast.error('Failed to update device');
    }
  };

  const infoCards = [
    { icon: FiSmartphone, label: 'Device', value: `${device?.brand || 'Unknown'} ${device?.model || ''}` },
    { icon: FiInfo, label: 'Platform', value: device?.platform || 'Unknown' },
    { icon: FiActivity, label: 'Status', value: device?.status || 'offline' },
    { icon: FiClock, label: 'Last Seen', value: new Date(device?.lastSeen).toLocaleString() },
    { icon: FiCpu, label: 'CPU Usage', value: `${device?.cpu || 0}%` },
    { icon: FiHardDrive, label: 'Memory', value: `${device?.memory || 0}%` },
    { icon: FiBattery, label: 'Battery', value: `${device?.battery?.level || 0}%` },
    { icon: FiWifi, label: 'Network', value: device?.network || 'Unknown' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Edit */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Device Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FiEdit2 /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiSave /> Save
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Device Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Group</label>
                <input
                  type="text"
                  value={editedGroup}
                  onChange={(e) => setEditedGroup(e.target.value)}
                  placeholder="e.g., Office, Home, Server"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Device ID</span>
                <span className="font-mono text-sm">{device?.deviceId}</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Group</span>
                <span>{device?.group || 'Ungrouped'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {infoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Icon className="text-purple-600 dark:text-purple-400" size={16} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{card.label}</span>
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Battery & Signal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battery Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiBattery /> Battery Details
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Level</span>
                <span className="text-sm font-medium">{device?.battery?.level || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    (device?.battery?.level || 0) > 50 ? 'bg-green-600' :
                    (device?.battery?.level || 0) > 20 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${device?.battery?.level || 0}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium">
                {device?.battery?.isCharging ? '🔌 Charging' : '🔋 Discharging'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temperature</span>
              <span className="text-sm font-medium">{device?.battery?.temperature || 'N/A'}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Health</span>
              <span className="text-sm font-medium">{device?.battery?.health || 'Good'}</span>
            </div>
          </div>
        </div>

        {/* Signal Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiSignal /> Signal Information
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Signal Strength</span>
                <span className="text-sm font-medium">{device?.signalInfo?.level || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${device?.signalInfo?.level || 0}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Network Type</span>
              <span className="text-sm font-medium">{device?.signalInfo?.type || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Operator</span>
              <span className="text-sm font-medium">{device?.signalInfo?.operator || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Signal Strength (dBm)</span>
              <span className="text-sm font-medium">{device?.signalInfo?.dBm || 'N/A'} dBm</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiInfo /> System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">OS Version</span>
            <span>{device?.systemInfo?.osVersion || 'Unknown'}</span>
          </div>
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Kernel Version</span>
            <span>{device?.systemInfo?.kernelVersion || 'Unknown'}</span>
          </div>
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Build Number</span>
            <span>{device?.systemInfo?.buildNumber || 'Unknown'}</span>
          </div>
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">API Level</span>
            <span>{device?.systemInfo?.apiLevel || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Security Patch</span>
            <span>{device?.systemInfo?.securityPatch || 'Unknown'}</span>
          </div>
          <div className="flex justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Uptime</span>
            <span>{device?.uptime ? `${Math.floor(device.uptime / 3600)} hours` : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* SIM Information */}
      {device?.simInfo && device.simInfo.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiZap /> SIM Information
          </h3>
          {device.simInfo.map((sim, idx) => (
            <div key={idx} className="mb-4 last:mb-0 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="font-medium mb-2">SIM {sim.simSlot + 1}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Carrier</div>
                <div>{sim.carrier}</div>
                <div className="text-gray-600">Phone Number</div>
                <div>{sim.phoneNumber || 'Unknown'}</div>
                <div className="text-gray-600">Country</div>
                <div>{sim.country}</div>
                <div className="text-gray-600">State</div>
                <div>{sim.state}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
