// client/src/services/axiosClient.js
import axios from 'axios';
import { storage } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        storage.clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh, user } = res.data.data;

        storage.setAccessToken(newAccess);
        storage.setRefreshToken(newRefresh);
        if (user) storage.setUser(user);

        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.clearAuth();
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
