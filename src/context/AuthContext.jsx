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

    // 🔧 FIX: Listen for token refresh events and update user info
    const handleTokenRefresh = () => {
      console.log('[AuthContext] Token refreshed, fetching updated user info...');
      refreshUserInfo();
    };

    // 🔧 FIX: Listen for force logout events (when refresh token fails)
    const handleForceLogout = () => {
      console.error('[AuthContext] Force logout triggered - tokens invalid');
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('tokenRefreshed', handleTokenRefresh);
    window.addEventListener('forceLogout', handleForceLogout);

    // 🔧 FIX: Periodically refresh user info every 5 minutes (safety net)
    // This ensures permissions stay up-to-date even if token refresh event is missed
    const refreshInterval = setInterval(() => {
      if (localStorage.getItem('accessToken')) {
        console.log('[AuthContext] Periodic user info refresh (every 5 min)');
        refreshUserInfo();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // 🔧 NEW: Check token expiry every minute and proactively refresh if needed
    const expiryCheckInterval = setInterval(() => {
      checkTokenExpiry();
    }, 60 * 1000); // 1 minute

    return () => {
      window.removeEventListener('tokenRefreshed', handleTokenRefresh);
      window.removeEventListener('forceLogout', handleForceLogout);
      clearInterval(refreshInterval);
      clearInterval(expiryCheckInterval);
    };
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authAPI.me();
        setUser(response.data);
        console.log('[AuthContext] User authenticated:', response.data.username);
      } catch (error) {
        console.error('[AuthContext] Auth check failed:', error.response?.status);
        // Clear invalid tokens
        localStorage.clear();
        setUser(null);
        
        // If we're not on login page, redirect
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/register' &&
            !window.location.pathname.startsWith('/reset-password')) {
          console.log('[AuthContext] Redirecting to login due to invalid token');
          window.location.href = '/login';
        }
      }
    }
    setLoading(false);
  };

  // 🔧 FIX: New function to refresh user info without loading state
  const refreshUserInfo = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authAPI.me();
        setUser(response.data);
        console.log('[AuthContext] User info updated with fresh permissions');
      } catch (error) {
        console.error('[AuthContext] Failed to refresh user info:', error);
        
        // If user info refresh fails, tokens might be invalid
        if (error.response?.status === 401) {
          console.error('[AuthContext] Tokens invalid, clearing and redirecting');
          localStorage.clear();
          setUser(null);
          window.location.href = '/login';
        }
      }
    }
  };

  // 🔧 NEW: Check token expiry and warn user
  const checkTokenExpiry = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      // Decode JWT to check expiry (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      // If token expires in less than 2 minutes, proactively refresh
      if (timeUntilExpiry < 2 * 60 * 1000 && timeUntilExpiry > 0) {
        console.warn('[AuthContext] Token expiring soon, proactively refreshing...');
        // Trigger a dummy request to force refresh via interceptor
        authAPI.me().catch(() => {});
      }
    } catch (error) {
      console.error('[AuthContext] Failed to decode token:', error);
    }
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
