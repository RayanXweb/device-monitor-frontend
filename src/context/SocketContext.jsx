'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      toast.success('Realtime connection established', { icon: '🔌', duration: 2000 });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      toast.error('Realtime connection lost', { icon: '⚠️' });
    });

    newSocket.on('device_update', (data) => {
      setLastMessage({ type: 'device_update', ...data });
    });

    newSocket.on('command_result', (data) => {
      setLastMessage({ type: 'command_result', ...data });
    });

    newSocket.on('alert', (data) => {
      setLastMessage({ type: 'alert', ...data });
      toast.error(data.message, { duration: 5000 });
    });

    newSocket.on('notification', (data) => {
      setLastMessage({ type: 'notification', ...data });
      toast.info(data.title, { duration: 3000 });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, token]);

  const sendCommand = useCallback((deviceId, command, params) => {
    if (socket && isConnected) {
      socket.emit('device_command', {
        deviceId,
        command,
        params,
        timestamp: new Date().toISOString(),
      });
    } else {
      toast.error('Not connected to server');
    }
  }, [socket, isConnected]);

  const subscribeToDevice = useCallback((deviceId) => {
    if (socket && isConnected) {
      socket.emit('subscribe', { deviceId });
    }
  }, [socket, isConnected]);

  const unsubscribeFromDevice = useCallback((deviceId) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe', { deviceId });
    }
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    lastMessage,
    sendCommand,
    subscribeToDevice,
    unsubscribeFromDevice,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
