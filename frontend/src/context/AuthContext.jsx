import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getCurrentUserApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUserApi();
          setUser(userData);
          localStorage.setItem('taskflow_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to verify token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
