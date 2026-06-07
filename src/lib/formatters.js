export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  if (weeks < 4) return `${weeks} weeks ago`;
  if (months < 12) return `${months} months ago`;
  return `${years} years ago`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

export const formatNumber = (num, options = {}) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US', options).format(num);
};

export const formatPercentage = (value) => {
  return `${formatNumber(value)}%`;
};

export const formatBytesPerSecond = (bytes) => {
  return `${formatFileSize(bytes)}/s`;
};

export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
