// server/src/controllers/coupon.controller.js
const couponService = require('../services/coupon.service');
const ApiResponse = require('../utils/ApiResponse');

const applyCoupon = async (req, res, next) => {
  try {
    const result = await couponService.applyCoupon(req.body);
    return ApiResponse.success(res, { message: 'Áp dụng mã giảm giá thành công', data: result });
  } catch (err) {
    next(err);
  }
};

const listCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.listCoupons();
    return ApiResponse.success(res, { data: coupons });
  } catch (err) {
    next(err);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return ApiResponse.created(res, 'Tạo mã giảm giá thành công', coupon);
  } catch (err) {
    next(err);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật mã giảm giá thành công', data: coupon });
  } catch (err) {
    next(err);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    return ApiResponse.success(res, { message: 'Xóa mã giảm giá thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyCoupon,
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
