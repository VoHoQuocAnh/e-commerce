// client/src/services/paymentApi.js
import axiosClient from './axiosClient';

export const paymentApi = {
  createMomoPayment: (orderId) => axiosClient.post('/payments/momo/create', { orderId }),
  verifyMomoRedirect: (params) => axiosClient.get('/payments/momo/verify', { params }),
};
