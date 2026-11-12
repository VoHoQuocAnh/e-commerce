// server/src/controllers/admin.controller.js
const dashboardService = require('../services/dashboard.service');
const orderService = require('../services/order.service');
const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return ApiResponse.success(res, { data: stats });
  } catch (err) {
    next(err);
  }
};

const listAllOrders = async (req, res, next) => {
  try {
    const { items, meta } = await orderService.listAllOrdersAdmin(req.query);
    return ApiResponse.success(res, { data: items, meta });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatusAdmin(req.params.id, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật trạng thái đơn hàng thành công', data: order });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const { items, meta } = await userService.listUsers(req.query);
    return ApiResponse.success(res, { data: items, meta });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUserByAdmin(req.params.id, req.user.id, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật tài khoản thành công', data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  listAllOrders,
  updateOrderStatus,
  listUsers,
  updateUser,
};
