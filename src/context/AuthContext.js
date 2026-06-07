import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { setAuthToken, removeAuthToken, getAuthToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check token expiration
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      setAuthToken(accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return accessToken;
    } catch (error) {
      logout();
      return null;
    }
  }, []);

  // Load user from token
  const loadUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token || isTokenExpired(token)) {
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error('Token expired');
        }
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        email,
        password,
      });

      const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data;
      
      setAuthToken(accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      router.push('/');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        name,
        email,
        password,
      });

      toast.success('Registration successful! Please login.');
      router.push('/login');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
      toast.success('Logged out successfully');
    }
  }, [router]);

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`, { email });
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password`, {
        token,
        password,
      });
      toast.success('Password reset successful! Please login.');
      router.push('/login');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reset password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
