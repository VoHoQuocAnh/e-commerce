// server/src/services/coupon.service.js
const { Coupon } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const calculateCouponDiscount = (coupon, subtotalAmount) => {
  const now = new Date();
  if (!coupon || !coupon.isActive) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa');
  }
  if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng');
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng');
  }
  if (Number(subtotalAmount) < Number(coupon.minOrderAmount)) {
    throw new ApiError(
      HTTP_CODES.BAD_REQUEST,
      `Đơn hàng tối thiểu ${Number(coupon.minOrderAmount).toLocaleString('vi-VN')}đ để áp dụng mã này`
    );
  }

  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = (Number(subtotalAmount) * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscountAmount && discount > Number(coupon.maxDiscountAmount)) {
      discount = Number(coupon.maxDiscountAmount);
    }
  } else {
    discount = Number(coupon.discountValue);
  }

  return Math.min(Math.round(discount), Number(subtotalAmount));
};

const applyCoupon = async ({ code, subtotalAmount }) => {
  const coupon = await Coupon.findOne({
    where: { code: code.trim().toUpperCase() },
  });

  const discountAmount = calculateCouponDiscount(coupon, subtotalAmount);
  return {
    couponId: coupon.id,
    code: coupon.code,
    description: coupon.description,
    discountAmount,
  };
};

const listCoupons = async () => {
  return Coupon.findAll({ order: [['created_at', 'DESC']] });
};

const createCoupon = async (payload) => {
  if (new Date(payload.endDate) <= new Date(payload.startDate)) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Ngày kết thúc phải sau ngày bắt đầu');
  }
  return Coupon.create(payload);
};

const updateCoupon = async (id, payload) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy mã giảm giá');
  }
  await coupon.update(payload);
  return coupon;
};

const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy mã giảm giá');
  }
  await coupon.destroy();
};

module.exports = {
  calculateCouponDiscount,
  applyCoupon,
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
