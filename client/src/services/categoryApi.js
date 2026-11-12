// client/src/services/categoryApi.js
import axiosClient from './axiosClient';

export const categoryApi = {
  getAll: (params) => axiosClient.get('/categories', { params }),
  getBySlug: (slug) => axiosClient.get(`/categories/${slug}`),
  create: (payload) => axiosClient.post('/categories', payload),
  update: (id, payload) => axiosClient.put(`/categories/${id}`, payload),
  remove: (id) => axiosClient.delete(`/categories/${id}`),
};
