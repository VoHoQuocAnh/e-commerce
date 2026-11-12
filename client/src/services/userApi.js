// client/src/services/userApi.js
import axiosClient from './axiosClient';

export const userApi = {
  getMe: () => axiosClient.get('/users/me'),
  updateMe: (formData) =>
    axiosClient.put('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: (payload) => axiosClient.put('/users/me/password', payload),
};
