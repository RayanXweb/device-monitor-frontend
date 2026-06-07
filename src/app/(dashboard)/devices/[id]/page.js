'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/hooks/useDevices';
import { useWebSocket } from '@/hooks/useWebSocket';
import DeviceProfile from '@/components/devices/DeviceProfile';
import DeviceCommands from '@/components/devices/DeviceCommands';
import DeviceSurveillance from '@/components/devices/DeviceSurveillance';
import DeviceMessages from '@/components/devices/DeviceMessages';
import DeviceLocation from '@/components/devices/DeviceLocation';
import DeviceFiles from '@/components/devices/DeviceFiles';
import DeviceSecurity from '@/components/devices/DeviceSecurity';
import LoadingScreen from '@/components/common/LoadingScreen';
import {
  FiArrowLeft,
  FiActivity,
  FiCpu,
  FiHardDrive,
  FiMapPin,
  FiMessageSquare,
  FiUsers,
  FiEye,
  FiCommand,
  FiFolder,
  FiShield,
  FiWifi,
  FiBattery,
  FiSignal
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.id;
  const { device, loading, fetchDevice, executeCommand } = useDevice(deviceId);
  const { isConnected, sendCommand } = useWebSocket();
  const [activeTab, setActiveTab] = useState('overview');
  const [realtimeData, setRealtimeData] = useState({});

  useEffect(() => {
    if (deviceId) {
      fetchDevice();
    }
  }, [deviceId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare },
    { id: 'contacts', label: 'Contacts', icon: FiUsers },
    { id: 'location', label: 'Location', icon: FiMapPin },
    { id: 'commands', label: 'Commands', icon: FiCommand },
    { id: 'surveillance', label: 'Surveillance', icon: FiEye },
    { id: 'files', label: 'Files', icon: FiFolder },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  const handleCommand = async (command, params) => {
    try {
      await executeCommand(command, params);
      toast.success(`Command ${command} executed successfully`);
    } catch (error) {
      toast.error(`Failed to execute ${command}: ${error.message}`);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!device) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Device not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-purple-600 hover:text-purple-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <FiArrowLeft /> Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center">
                <FiActivity className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{device.deviceName}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">ID: {device.deviceId}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FiBattery className="text-green-600" />
              <span>{device.battery?.level || 0}%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FiSignal className="text-blue-600" />
              <span>{device.signalInfo?.level || 0}%</span>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              device.status === 'online'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {device.status?.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <DeviceProfile device={device} />}
          {activeTab === 'messages' && <DeviceMessages deviceId={deviceId} />}
          {activeTab === 'contacts' && <DeviceContacts deviceId={deviceId} />}
          {activeTab === 'location' && <DeviceLocation deviceId={deviceId} />}
          {activeTab === 'commands' && <DeviceCommands deviceId={deviceId} onCommand={handleCommand} />}
          {activeTab === 'surveillance' && <DeviceSurveillance deviceId={deviceId} onCommand={handleCommand} />}
          {activeTab === 'files' && <DeviceFiles deviceId={deviceId} />}
          {activeTab === 'security' && <DeviceSecurity device={device} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
