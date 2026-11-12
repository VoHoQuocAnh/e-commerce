// client/src/services/reviewApi.js
import axiosClient from './axiosClient';

export const reviewApi = {
  getByProduct: (productId, params) => axiosClient.get(`/reviews/product/${productId}`, { params }),
  create: (payload) => axiosClient.post('/reviews', payload),
  remove: (id) => axiosClient.delete(`/reviews/${id}`),
};
