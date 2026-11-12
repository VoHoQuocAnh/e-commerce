// client/src/services/addressApi.js
import axiosClient from './axiosClient';

export const addressApi = {
  getAll: () => axiosClient.get('/users/me/addresses'),
  create: (payload) => axiosClient.post('/users/me/addresses', payload),
  update: (id, payload) => axiosClient.put(`/users/me/addresses/${id}`, payload),
  remove: (id) => axiosClient.delete(`/users/me/addresses/${id}`),
  setDefault: (id) => axiosClient.patch(`/users/me/addresses/${id}/default`),
};
