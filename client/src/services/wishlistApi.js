// client/src/services/wishlistApi.js
import axiosClient from './axiosClient';

export const wishlistApi = {
  getAll: () => axiosClient.get('/wishlists'),
  toggle: (productId) => axiosClient.post('/wishlists/toggle', { productId }),
};
