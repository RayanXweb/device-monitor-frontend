'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiServer, FiDatabase, FiGlobe, FiClock, 
  FiCheckCircle, FiXCircle, FiActivity, FiCpu
} from 'react-icons/fi';

export default function SystemStatus() {
  const [status, setStatus] = useState({
    api: 'checking',
    websocket: 'checking',
    database: 'checking',
    redis: 'checking',
    uptime: 0,
    version: '3.0.0',
  });

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      // Check API
      const apiResponse = await fetch('/api/health');
      setStatus(prev => ({ ...prev, api: apiResponse.ok ? 'healthy' : 'unhealthy' }));
      
      // Check WebSocket
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
      ws.onopen = () => {
        setStatus(prev => ({ ...prev, websocket: 'healthy' }));
        ws.close();
      };
      ws.onerror = () => {
        setStatus(prev => ({ ...prev, websocket: 'unhealthy' }));
      };
      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          setStatus(prev => ({ ...prev, websocket: 'unhealthy' }));
          ws.close();
        }
      }, 5000);
    } catch (error) {
      setStatus(prev => ({ ...prev, api: 'unhealthy', websocket: 'unhealthy' }));
    }
  };

  const statusItems = [
    { key: 'api', label: 'API Server', icon: FiServer },
    { key: 'websocket', label: 'WebSocket', icon: FiGlobe },
    { key: 'database', label: 'Database', icon: FiDatabase },
    { key: 'redis', label: 'Cache', icon: FiCpu },
  ];

  const getStatusColor = (state) => {
    switch (state) {
      case 'healthy': return 'text-green-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (state) => {
    switch (state) {
      case 'healthy': return <FiCheckCircle className={getStatusColor(state)} size={16} />;
      case 'unhealthy': return <FiXCircle className={getStatusColor(state)} size={16} />;
      default: return <FiActivity className={getStatusColor(state)} size={16} className="animate-spin" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FiActivity className="text-purple-600" size={20} />
          <h3 className="font-semibold text-gray-800 dark:text-white">System Status</h3>
        </div>
        <button
          onClick={checkStatus}
          className="text-xs text-purple-600 hover:text-purple-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const state = status[item.key];
          return (
            <div key={item.key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon className={`mx-auto mb-2 ${getStatusColor(state)}`} size={20} />
              <div className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getStatusIcon(state)}
                <span className={`text-xs capitalize ${getStatusColor(state)}`}>
                  {state}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Uptime</span>
          <span className="text-gray-800 dark:text-white">
            {Math.floor(status.uptime / 3600)}h {Math.floor((status.uptime % 3600) / 60)}m
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Version</span>
          <span className="text-gray-800 dark:text-white">v{status.version}</span>
        </div>
      </div>
    </div>
  );
                          }
