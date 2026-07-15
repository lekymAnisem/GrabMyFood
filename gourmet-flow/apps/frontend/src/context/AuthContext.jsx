import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken, refreshToken } = res.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { user: userData, accessToken, refreshToken } = res.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const refreshTokenCb = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken || storedRefreshToken === 'undefined') {
      logout();
      return;
    }
    try {
      const res = await api.post('/auth/refresh', { refreshToken: storedRefreshToken });
      const { accessToken, refreshToken: newRefreshToken } = res.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(accessToken);
    } catch {
      logout();
    }
  }, [logout]);

  const refreshGuard = useRef(false);

  useEffect(() => {
    if (localStorage.getItem('user') === 'undefined') {
      localStorage.removeItem('user');
    }
    if (localStorage.getItem('token') === 'undefined') {
      localStorage.removeItem('token');
    }
    if (localStorage.getItem('refreshToken') === 'undefined') {
      localStorage.removeItem('refreshToken');
    }
    if (token && !refreshGuard.current) {
      refreshGuard.current = true;
      refreshTokenCb();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, refreshToken: refreshTokenCb }}>
      {children}
    </AuthContext.Provider>
  );
}
