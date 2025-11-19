import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set base URL for axios
  axios.defaults.baseURL = 'http://localhost:5000';

  // Set auth token for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/profile');
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', otpData);
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  };

  const signin = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/signin', credentials);
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signin failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await axios.post('/api/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await axios.post('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  };

  const value = {
    user,
    token,
    loading,
    signup,
    verifyOTP,
    signin,
    logout,
    forgotPassword,
    resetPassword,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};