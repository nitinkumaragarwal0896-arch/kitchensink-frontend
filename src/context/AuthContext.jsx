import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authAPI.me();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    const { accessToken, refreshToken, username: name, roles } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Fetch full user details
    const userResponse = await authAPI.me();
    setUser(userResponse.data);
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || user?.roles?.includes(`ROLE_${role}`);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const isAdmin = () => hasRole('ADMIN');
  const isModerator = () => hasRole('MODERATOR') || isAdmin();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      hasRole,
      hasPermission,
      isAdmin,
      isModerator,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
