'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, FiBell, FiLock, FiShield, FiGlobe, 
  FiDatabase, FiRefreshCw, FiSave, FiAlertCircle,
  FiMonitor, FiVolume2, FiBattery, FiWifi
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceSettings({ device, onUpdate }) {
  const [settings, setSettings] = useState({
    alertThresholds: device?.alertThresholds || {
      cpu: 80,
      memory: 85,
      battery: 20,
      signal: 30,
    },
    monitoring: {
      autoSync: true,
      syncInterval: 30,
      keepHistory: true,
      historyDays: 30,
    },
    notifications: {
      onAlert: true,
      onDeviceOffline: true,
      onCommandComplete: true,
      onLowBattery: true,
    },
    privacy: {
      encryptData: true,
      blurSensitiveInfo: true,
      logAllCommands: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');

  const tabs = [
    { id: 'alerts', label: 'Alert Thresholds', icon: FiBell },
    { id: 'monitoring', label: 'Monitoring', icon: FiMonitor },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy & Security', icon: FiShield },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/devices/${device.deviceId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        toast.success('Settings saved successfully');
        onUpdate?.();
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to default?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/devices/${device.deviceId}/settings/reset`, {
        method: 'POST',
      });
      
      if (response.ok) {
        toast.success('Settings reset to default');
        onUpdate?.();
      } else {
        throw new Error('Reset failed');
      }
    } catch (error) {
      toast.error('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Alert Thresholds */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPU Alert Threshold: {settings.alertThresholds.cpu}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alertThresholds.cpu}
                  onChange={(e) => setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, cpu: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Memory Alert Threshold: {settings.alertThresholds.memory}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alertThresholds.memory}
                  onChange={(e) => setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, memory: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Battery Alert Threshold: {settings.alertThresholds.battery}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alertThresholds.battery}
                  onChange={(e) => setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, battery: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Signal Alert Threshold: {settings.alertThresholds.signal}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alertThresholds.signal}
                  onChange={(e) => setSettings({
                    ...settings,
                    alertThresholds: { ...settings.alertThresholds, signal: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Monitoring Settings */}
          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Auto Sync</div>
                  <div className="text-sm text-gray-500">Automatically sync device data</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.monitoring.autoSync}
                  onChange={(e) => setSettings({
                    ...settings,
                    monitoring: { ...settings.monitoring, autoSync: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sync Interval (seconds): {settings.monitoring.syncInterval}
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={settings.monitoring.syncInterval}
                  onChange={(e) => setSettings({
                    ...settings,
                    monitoring: { ...settings.monitoring, syncInterval: parseInt(e.target.value) }
                  })}
                  className="w-full"
                  disabled={!settings.monitoring.autoSync}
                />
              </div>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Keep History</div>
                  <div className="text-sm text-gray-500">Store historical data</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.monitoring.keepHistory}
                  onChange={(e) => setSettings({
                    ...settings,
                    monitoring: { ...settings.monitoring, keepHistory: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              {settings.monitoring.keepHistory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    History Retention (days): {settings.monitoring.historyDays}
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="365"
                    step="7"
                    value={settings.monitoring.historyDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      monitoring: { ...settings.monitoring, historyDays: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">On Alert</div>
                  <div className="text-sm text-gray-500">Receive notifications for alerts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.onAlert}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onAlert: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">On Device Offline</div>
                  <div className="text-sm text-gray-500">Notify when device goes offline</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.onDeviceOffline}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onDeviceOffline: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">On Command Complete</div>
                  <div className="text-sm text-gray-500">Notify when command finishes</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.onCommandComplete}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onCommandComplete: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">On Low Battery</div>
                  <div className="text-sm text-gray-500">Alert when battery is low</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.onLowBattery}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onLowBattery: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Encrypt Data</div>
                  <div className="text-sm text-gray-500">Encrypt sensitive device data</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.encryptData}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, encryptData: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Blur Sensitive Info</div>
                  <div className="text-sm text-gray-500">Hide sensitive information in UI</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.blurSensitiveInfo}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, blurSensitiveInfo: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">Log All Commands</div>
                  <div className="text-sm text-gray-500">Keep history of all executed commands</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.logAllCommands}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, logAllCommands: e.target.checked }
                  })}
                  className="toggle"
                />
              </label>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t dark:border-gray-700 flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            {loading ? <div className="loader-sm"></div> : <FiSave />}
            Save Settings
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </div>
    </div>
  );
                  }
