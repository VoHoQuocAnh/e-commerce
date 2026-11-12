// client/src/services/adminApi.js
import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardStats: () => axiosClient.get('/admin/dashboard/stats'),
  getOrders: (params) => axiosClient.get('/admin/orders', { params }),
  updateOrderStatus: (id, payload) => axiosClient.patch(`/admin/orders/${id}/status`, payload),
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  updateUserRoleOrStatus: (id, payload) => axiosClient.patch(`/admin/users/${id}/role`, payload),
};
