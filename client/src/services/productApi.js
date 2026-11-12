// client/src/services/productApi.js
import axiosClient from './axiosClient';

export const productApi = {
  getAll: (params) => axiosClient.get('/products', { params }),
  getBySlug: (slug) => axiosClient.get(`/products/${slug}`),
  getById: (id) => axiosClient.get(`/products/id/${id}`),
  create: (formData) =>
    axiosClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    axiosClient.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id) => axiosClient.delete(`/products/${id}`),
  addVariant: (productId, payload) => axiosClient.post(`/products/${productId}/variants`, payload),
  updateVariant: (productId, variantId, payload) =>
    axiosClient.put(`/products/${productId}/variants/${variantId}`, payload),
  removeVariant: (productId, variantId) =>
    axiosClient.delete(`/products/${productId}/variants/${variantId}`),
};
