'use client';

import { useState, useEffect, useCallback } from 'react';

export function useNotification() {
  const [permission, setPermission] = useState('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }, [supported]);

  const showNotification = useCallback((title, options = {}) => {
    if (!supported || permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/favicon-32x32.png',
        ...options,
      });

      notification.onclick = () => {
        if (options.url) {
          window.open(options.url, '_blank');
        }
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
      return notification;
    } catch (error) {
      console.error('Notification error:', error);
    }
  }, [supported, permission]);

  return {
    supported,
    permission,
    requestPermission,
    showNotification,
  };
}
