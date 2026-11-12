// client/src/services/couponApi.js
import axiosClient from './axiosClient';

export const couponApi = {
  apply: (payload) => axiosClient.post('/coupons/apply', payload),
  getAllAdmin: () => axiosClient.get('/coupons'),
  create: (payload) => axiosClient.post('/coupons', payload),
  update: (id, payload) => axiosClient.put(`/coupons/${id}`, payload),
  remove: (id) => axiosClient.delete(`/coupons/${id}`),
};
