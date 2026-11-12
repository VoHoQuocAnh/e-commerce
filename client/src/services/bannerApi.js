// client/src/services/bannerApi.js
import axiosClient from './axiosClient';

export const bannerApi = {
  getActive: () => axiosClient.get('/banners'),
  getAllAdmin: () => axiosClient.get('/banners/all'),
  create: (formData) =>
    axiosClient.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    axiosClient.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id) => axiosClient.delete(`/banners/${id}`),
};
