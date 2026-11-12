// server/src/controllers/cart.controller.js
const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/ApiResponse');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    return ApiResponse.success(res, { data: cart });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.user.id, req.body);
    return ApiResponse.success(res, { message: 'Đã thêm sản phẩm vào giỏ hàng', data: cart });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateItemQuantity(req.user.id, req.params.itemId, req.body.quantity);
    return ApiResponse.success(res, { message: 'Cập nhật giỏ hàng thành công', data: cart });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    return ApiResponse.success(res, { message: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    return ApiResponse.success(res, { message: 'Đã làm trống giỏ hàng', data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
