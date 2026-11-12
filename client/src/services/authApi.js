// client/src/services/authApi.js
import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  logout: (refreshToken) => axiosClient.post('/auth/logout', { refreshToken }),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => axiosClient.post('/auth/reset-password', payload),
};
