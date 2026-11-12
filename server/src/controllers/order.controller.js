// server/src/controllers/order.controller.js
const orderService = require('../services/order.service');
const ApiResponse = require('../utils/ApiResponse');

const createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.user.id, req.body);
    return ApiResponse.created(res, 'Đặt hàng thành công', result);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { items, meta } = await orderService.getMyOrders(req.user.id, req.query);
    return ApiResponse.success(res, { data: items, meta });
  } catch (err) {
    next(err);
  }
};

const getOrderByCode = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByCode(req.params.orderCode, req.user);
    return ApiResponse.success(res, { data: order });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrderByUser(
      req.user.id,
      req.params.orderCode,
      req.body.reason
    );
    return ApiResponse.success(res, { message: 'Hủy đơn hàng thành công', data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderByCode,
  cancelOrder,
};
