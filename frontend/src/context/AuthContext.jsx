import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isServerWakingUp, setIsServerWakingUp] = useState(false);

  // Restore session on application load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const timer = setTimeout(() => {
        setIsServerWakingUp(true);
      }, 2000);

      try {
        const res = await api.get('/api/auth/me');
        clearTimeout(timer);
        setIsServerWakingUp(false);
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        clearTimeout(timer);
        setIsServerWakingUp(false);
        console.error('Session restore failed:', err.message);
        // Only clear token if we got a direct auth error (401 or 403) from the server.
        // Keep the token if it's a network timeout / server waking up / connection error.
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try a different email.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Google authentication handler
  const loginWithGoogle = async (credential) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/google', { credential });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Google Authentication failed.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isServerWakingUp,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
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
