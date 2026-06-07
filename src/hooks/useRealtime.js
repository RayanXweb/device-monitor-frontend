'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export function useRealtime(deviceId) {
  const [realtimeData, setRealtimeData] = useState({
    cpu: 0,
    memory: 0,
    battery: 0,
    signal: 0,
    location: null,
    lastUpdate: null,
  });
  const [isLive, setIsLive] = useState(false);
  const { isConnected, sendCommand, subscribeToDevice, unsubscribeFromDevice } = useWebSocket();

  useEffect(() => {
    if (deviceId && isConnected && isLive) {
      subscribeToDevice(deviceId);
      return () => {
        unsubscribeFromDevice(deviceId);
      };
    }
  }, [deviceId, isConnected, isLive, subscribeToDevice, unsubscribeFromDevice]);

  const startLiveMonitoring = useCallback(() => {
    setIsLive(true);
    sendCommand(deviceId, 'START_LIVE_MONITORING', {});
  }, [deviceId, sendCommand]);

  const stopLiveMonitoring = useCallback(() => {
    setIsLive(false);
    sendCommand(deviceId, 'STOP_LIVE_MONITORING', {});
  }, [deviceId, sendCommand]);

  const updateRealtimeData = useCallback((data) => {
    setRealtimeData(prev => ({
      ...prev,
      ...data,
      lastUpdate: new Date(),
    }));
  }, []);

  return {
    realtimeData,
    isLive,
    isConnected,
    startLiveMonitoring,
    stopLiveMonitoring,
    updateRealtimeData,
  };
}
