import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const { data } = await api.post('/auth/login', { email, password, remember });
      if (data.requiresMfa) {
        toast.success('OTP sent to your email.');
        return data;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Registration successful!');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const { data } = await api.post('/auth/google-login', googleData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Welcome to AMMA!');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      toast.success(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email, otp, password) => {
    try {
      const { data } = await api.put('/auth/reset-password', { email, otp, password });
      toast.success(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const verifyAdminMfa = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-mfa', { email, otp });
      if (data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, forgotPassword, verifyOtp, resetPassword, googleLogin, updateProfile, verifyAdminMfa, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
