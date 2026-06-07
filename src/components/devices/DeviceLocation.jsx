'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, FiRefreshCw, FiClock, FiNavigation, 
  FiCompass, FiTarget, FiActivity, FiMap
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceLocation({ deviceId }) {
  const [location, setLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchLocation();
    fetchLocationHistory();
    
    let interval;
    if (tracking) {
      interval = setInterval(fetchLocation, 5000);
    }
    return () => clearInterval(interval);
  }, [deviceId, tracking]);

  const fetchLocation = async () => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/location`);
      const data = await response.json();
      setLocation(data.data);
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };

  const fetchLocationHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      
      const response = await fetch(`/api/devices/${deviceId}/location/history?${params}`);
      const data = await response.json();
      setLocationHistory(data.data || []);
    } catch (error) {
      console.error('Failed to fetch location history:', error);
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    try {
      await fetch(`/api/devices/${deviceId}/location/refresh`, { method: 'POST' });
      toast.success('Location refresh requested');
      setTimeout(fetchLocation, 2000);
    } catch (error) {
      toast.error('Failed to refresh location');
    } finally {
      setLoading(false);
    }
  };

  const startLiveTracking = () => {
    setTracking(true);
    toast.success('Live tracking started');
  };

  const stopLiveTracking = () => {
    setTracking(false);
    toast.success('Live tracking stopped');
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(locationHistory, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `location_history_${deviceId}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported');
  };

  return (
    <div className="space-y-6">
      {/* Current Location */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Current Location</h3>
          </div>
          <div className="flex gap-2">
            {!tracking ? (
              <button
                onClick={startLiveTracking}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FiActivity /> Start Live Tracking
              </button>
            ) : (
              <button
                onClick={stopLiveTracking}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FiActivity className="animate-pulse" /> Stop Tracking
              </button>
            )}
            <button
              onClick={refreshLocation}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {location ? (
          <div className="space-y-4">
            {/* Map Placeholder - In production, integrate with Google Maps or Mapbox */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center relative">
              <div className="text-center">
                <FiMap className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Map will be displayed here</p>
                <p className="text-sm text-gray-400">
                  Coordinates: {location.latitude}, {location.longitude}
                </p>
              </div>
              {tracking && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse flex items-center gap-1">
                    <FiActivity size={10} /> LIVE
                  </span>
                </div>
              )}
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiNavigation /> Address
                </div>
                <div className="font-medium">{location.address || 'Unknown'}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiTarget /> Accuracy
                </div>
                <div className="font-medium">{location.accuracy} meters</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiCompass /> Speed
                </div>
                <div className="font-medium">{location.speed || 0} m/s</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FiClock /> Last Update
                </div>
                <div className="font-medium">{new Date(location.timestamp).toLocaleString()}</div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="text-sm text-gray-500">
              Provider: {location.provider || 'GPS'} | 
              Altitude: {location.altitude || 'N/A'}m
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No location data available. Click refresh to get current location.
          </div>
        )}
      </div>

      {/* Location History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Location History</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={fetchLocationHistory}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Filter
            </button>
            <button
              onClick={exportHistory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {locationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No location history available</div>
          ) : (
            locationHistory.map((loc, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-purple-600" size={16} />
                    <span className="font-medium">
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(loc.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Accuracy: {loc.accuracy}m | Speed: {loc.speed || 0}m/s
                </div>
                {loc.address && (
                  <div className="text-sm text-gray-500 mt-1">{loc.address}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
              }
