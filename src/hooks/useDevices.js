'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    avgCpu: 0,
    avgMemory: 0,
  });
  const { isAuthenticated } = useAuth();

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices`);
      const devicesData = response.data.data;
      setDevices(devicesData);
      
      const online = devicesData.filter(d => d.status === 'online').length;
      const avgCpu = devicesData.reduce((sum, d) => sum + (parseFloat(d.cpu) || 0), 0) / (devicesData.length || 1);
      const avgMemory = devicesData.reduce((sum, d) => sum + (parseFloat(d.memory) || 0), 0) / (devicesData.length || 1);
      
      setStats({
        total: devicesData.length,
        online,
        offline: devicesData.length - online,
        avgCpu: avgCpu.toFixed(1),
        avgMemory: avgMemory.toFixed(1),
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const deleteDevice = useCallback(async (deviceId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${deviceId}`);
      toast.success('Device removed successfully');
      await fetchDevices();
    } catch (err) {
      toast.error('Failed to remove device');
    }
  }, [fetchDevices]);

  const refreshDevices = useCallback(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    stats,
    deleteDevice,
    refreshDevices,
  };
};

export const useDevice = (deviceId) => {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevice = useCallback(async () => {
    if (!deviceId) return;

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${deviceId}`);
      setDevice(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch device details');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const executeCommand = useCallback(async (command, params) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${deviceId}/commands`, {
        command,
        params,
      });
      toast.success(`Command ${command} sent successfully`);
      return response.data;
    } catch (err) {
      toast.error(`Failed to execute ${command}`);
      throw err;
    }
  }, [deviceId]);

  useEffect(() => {
    fetchDevice();
  }, [fetchDevice]);

  return {
    device,
    loading,
    error,
    fetchDevice,
    executeCommand,
  };
};
