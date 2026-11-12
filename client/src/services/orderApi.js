// client/src/services/orderApi.js
import axiosClient from './axiosClient';

export const orderApi = {
  create: (payload) => axiosClient.post('/orders', payload),
  getMyOrders: (params) => axiosClient.get('/orders/my-orders', { params }),
  getByCode: (orderCode) => axiosClient.get(`/orders/${orderCode}`),
  cancelOrder: (orderCode, reason) =>
    axiosClient.patch(`/orders/${orderCode}/cancel`, { reason }),
};
