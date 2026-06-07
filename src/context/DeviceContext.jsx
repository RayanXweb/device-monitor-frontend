'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DeviceContext = createContext();

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDeviceContext must be used within DeviceProvider');
  }
  return context;
};

export function DeviceProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/devices');
      const data = await response.json();
      setDevices(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getDevice = useCallback(async (deviceId) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`);
      const data = await response.json();
      setSelectedDevice(data.data);
      return data.data;
    } catch (error) {
      toast.error('Failed to fetch device details');
      return null;
    }
  }, []);

  const updateDevice = useCallback(async (deviceId, updates) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        toast.success('Device updated successfully');
        fetchDevices();
        return true;
      }
      throw new Error('Update failed');
    } catch (error) {
      toast.error('Failed to update device');
      return false;
    }
  }, [fetchDevices]);

  const deleteDevice = useCallback(async (deviceId) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Device deleted successfully');
        fetchDevices();
        return true;
      }
      throw new Error('Delete failed');
    } catch (error) {
      toast.error('Failed to delete device');
      return false;
    }
  }, [fetchDevices]);

  const executeCommand = useCallback(async (deviceId, command, params) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/commands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, params }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Command ${command} sent successfully`);
        return data;
      }
      throw new Error('Command failed');
    } catch (error) {
      toast.error(`Failed to execute ${command}`);
      return null;
    }
  }, []);

  const value = {
    devices,
    selectedDevice,
    loading,
    fetchDevices,
    getDevice,
    updateDevice,
    deleteDevice,
    executeCommand,
    setSelectedDevice,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}
