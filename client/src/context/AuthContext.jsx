// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { userApi } from '../services/userApi';
import { storage } from '../utils/storage';
import { notify } from '../components/feedback/Toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async () => {
    const token = storage.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await userApi.getMe();
      setUser(res.data);
      storage.setUser(res.data);
    } catch {
      storage.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncProfile();
    const handleUnauthorized = () => {
      setUser(null);
      notify.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [syncProfile]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { user: loggedUser, accessToken, refreshToken } = res.data;
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    storage.setUser(loggedUser);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    const { user: createdUser, accessToken, refreshToken } = res.data;
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    storage.setUser(createdUser);
    setUser(createdUser);
    return createdUser;
  };

  const logout = async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore network error on logout
    } finally {
      storage.clearAuth();
      setUser(null);
    }
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
