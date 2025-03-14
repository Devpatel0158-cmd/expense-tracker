import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const grabUser = async () => {
      try {
        const response = await api.get('/api/user');
        setUser(response.data);
      } catch (err) {
        setError('Couldn’t load user info.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    grabUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Login didn’t work. Check your info or the server.');
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await api.post('/api/auth/register', { email, password, name });
      setUser(response.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Sign-up failed. Check your details or backend status.');
      throw err;
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await api.post('/api/auth/reset-password', { email });
      setError(null);
      return response.data;
    } catch (err) {
      setError('Reset failed. Check your email or the server.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Logout failed.');
      throw err;
    }
  };

  return { user, loading, error, login, signup, resetPassword, logout };
};