// AUTH: Authentication Context and user state provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fixora_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = async () => {
    try {
      if (!localStorage.getItem('fixora_token')) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.warn('[AUTH: SESSION_EXPIRED]', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        localStorage.setItem('fixora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.profile);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    }
  };

  const registerCustomer = async (formData) => {
    setError(null);
    try {
      const res = await api.registerCustomer(formData);
      if (res.success && res.data) {
        localStorage.setItem('fixora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.customerProfile);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const registerProvider = async (formData) => {
    setError(null);
    try {
      const res = await api.registerProvider(formData);
      if (res.success && res.data) {
        localStorage.setItem('fixora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.providerProfile);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Provider registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('fixora_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const loginWithGoogle = async (payload) => {
    setError(null);
    try {
      const res = await api.googleAuth(payload);
      if (res.success && res.data) {
        localStorage.setItem('fixora_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.profile);
        return res.data.user;
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await api.updateProfile(profileData);
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        return res.data;
      }
    } catch (err) {
      setError(err.message || 'Profile update failed.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        error,
        login,
        loginWithGoogle,
        registerCustomer,
        registerProvider,
        updateProfile,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
