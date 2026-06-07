'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useDevices } from '@/hooks/useDevices';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';
import DeviceCard from '@/components/dashboard/DeviceCard';
import MetricsChart from '@/components/dashboard/MetricsChart';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import LoadingScreen from '@/components/common/LoadingScreen';
import { 
  FiMonitor, FiCpu, FiHardDrive, FiActivity, FiRefreshCw, 
  FiDownload, FiFilter, FiGrid, FiList, FiPlus, FiZap,
  FiShield, FiUsers, FiTrendingUp, FiTrendingDown
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { devices, loading, refreshDevices, stats, deleteDevice } = useDevices();
  const { isConnected, lastMessage, sendCommand } = useWebSocket();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [realtimeMetrics, setRealtimeMetrics] = useState([]);

  // Fetch dashboard stats
  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/stats`);
      return res.json();
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshDevices();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshDevices]);

  useEffect(() => {
    if (lastMessage) {
      handleRealtimeUpdate(lastMessage);
    }
  }, [lastMessage]);

  const handleRealtimeUpdate = (data) => {
    if (data.type === 'device_update') {
      setRealtimeMetrics(prev => [data, ...prev].slice(0, 20));
      toast.success(`${data.deviceName} updated`, { icon: '🔄' });
      refreshDevices();
    } else if (data.type === 'command_result') {
      toast.success(`Command ${data.commandId} completed`, { icon: '✅' });
    } else if (data.type === 'alert') {
      toast.error(data.message, { icon: '⚠️', duration: 5000 });
    }
  };

  const filteredDevices = devices.filter(device => {
    if (filter !== 'all' && device.status !== filter) return false;
    if (searchTerm && !device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const dataStr = JSON.stringify(devices, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `devices_export_${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Data exported successfully');
  };

  if (loading && devices.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time device monitoring and analytics dashboard
            {isConnected ? (
              <span className="ml-2 inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                <span className="text-xs text-green-600 dark:text-green-400">Live Connection</span>
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                <span className="text-xs text-red-600 dark:text-red-400">Disconnected</span>
              </span>
            )}
          </p>
        </div>
        <Link href="/connect">
          <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105">
            <FiPlus size={20} /> Connect New Device
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={stats.total}
          icon={FiMonitor}
          color="purple"
          change={{ value: '+12%', trend: 'up' }}
        />
        <StatsCard
          title="Online Devices"
          value={stats.online}
          icon={FiActivity}
          color="green"
          change={{ value: '+5%', trend: 'up' }}
        />
        <StatsCard
          title="Avg CPU Usage"
          value={`${stats.avgCpu}%`}
          icon={FiCpu}
          color="blue"
          change={{ value: '+3%', trend: 'up' }}
        />
        <StatsCard
          title="Active Alerts"
          value={dashboardStats?.activeAlerts || 0}
          icon={FiShield}
          color="red"
          change={{ value: '-2', trend: 'down' }}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart data={devices} type="line" title="CPU & Memory Usage Trends" height={400} />
        <AlertsWidget devices={devices} />
      </div>

      {/* Recent Activity */}
      <RecentActivity devices={devices} realtimeUpdates={realtimeMetrics} />

      {/* Controls Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {['all', 'online', 'offline'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                  filter === option
                    ? option === 'online' 
                      ? 'bg-green-600 text-white shadow-lg'
                      : option === 'offline'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition ${
                autoRefresh ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FiRefreshCw className={autoRefresh ? 'animate-spin-slow' : ''} />
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FiDownload /> Export
            </button>
            
            <button
              onClick={refreshDevices}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
        >
          <FiMonitor className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Devices Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm ? `No devices match "${searchTerm}"` : "You haven't connected any devices yet"}
          </p>
          {!searchTerm && (
            <Link href="/connect">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-flex items-center gap-2">
                <FiPlus /> Connect Your First Device
              </button>
            </Link>
          )}
        </motion.div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onDelete={deleteDevice}
              onCommand={sendCommand}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CPU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Memory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Battery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDevices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{device.deviceName}</div>
                        <div className="text-sm text-gray-500">{device.platform}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.status === 'online' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${device.cpu || 0}%` }} />
                        </div>
                        <span>{device.cpu || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${device.memory || 0}%` }} />
                        </div>
                        <span>{device.memory || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className={`h-2 rounded-full ${
                            (device.battery?.level || 0) > 50 ? 'bg-green-600' :
                            (device.battery?.level || 0) > 20 ? 'bg-yellow-600' : 'bg-red-600'
                          }`} style={{ width: `${device.battery?.level || 0}%` }} />
                        </div>
                        <span>{device.battery?.level || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(device.lastSeen).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/devices/${device.deviceId}`}>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
      }
