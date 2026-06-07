'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);
  const { isAuthenticated, refreshToken } = useAuth();

  const connect = useCallback(async () => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      toast.success('Realtime connection established', { icon: '🔌' });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      toast.error('Realtime connection lost', { icon: '⚠️' });
    });

    socket.on('device_update', (data) => {
      setLastMessage({ type: 'device_update', ...data });
    });

    socket.on('command_result', (data) => {
      setLastMessage({ type: 'command_result', ...data });
    });

    socket.on('alert', (data) => {
      setLastMessage({ type: 'alert', ...data });
      toast.error(data.message, { duration: 5000 });
    });

    socket.on('notification', (data) => {
      setLastMessage({ type: 'notification', ...data });
      toast.info(data.title, { duration: 3000 });
    });

    socketRef.current = socket;
  }, [isAuthenticated]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendCommand = useCallback((deviceId, command, params) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('device_command', {
        deviceId,
        command,
        params,
        timestamp: new Date().toISOString(),
      });
    } else {
      toast.error('Not connected to server');
    }
  }, [isConnected]);

  const subscribeToDevice = useCallback((deviceId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('subscribe', { deviceId });
    }
  }, [isConnected]);

  const unsubscribeFromDevice = useCallback((deviceId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('unsubscribe', { deviceId });
    }
  }, [isConnected]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendCommand,
    subscribeToDevice,
    unsubscribeFromDevice,
  };
};
