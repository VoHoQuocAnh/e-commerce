// server/tests/unit/coupon.service.test.js
require('../setup');
const { calculateCouponDiscount } = require('../../src/services/coupon.service');

describe('Unit Test: Coupon Discount Service (calculateCouponDiscount)', () => {
  const baseValidCoupon = {
    id: 1,
    code: 'CALEM10',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 300000,
    maxDiscountAmount: 50000,
    usageLimit: 100,
    usedCount: 10,
    startDate: new Date(Date.now() - 86400000),
    endDate: new Date(Date.now() + 86400000),
    isActive: true,
  };

  test('Tính đúng giảm giá theo % và áp trần maxDiscountAmount', () => {
    const discount1 = calculateCouponDiscount(baseValidCoupon, 400000);
    expect(discount1).toBe(40000);

    // 10% của 800,000đ = 80,000đ nhưng bị giới hạn trần 50,000đ
    const discount2 = calculateCouponDiscount(baseValidCoupon, 800000);
    expect(discount2).toBe(50000);
  });

  test('Tính đúng giảm giá số tiền cố định (fixed)', () => {
    const fixedCoupon = {
      ...baseValidCoupon,
      code: 'CHAOBAN50K',
      discountType: 'fixed',
      discountValue: 50000,
      maxDiscountAmount: null,
    };
    const discount = calculateCouponDiscount(fixedCoupon, 450000);
    expect(discount).toBe(50000);
  });

  test('Báo lỗi khi đơn hàng chưa đạt giá trị tối thiểu (minOrderAmount)', () => {
    expect(() => calculateCouponDiscount(baseValidCoupon, 200000)).toThrow(
      /Đơn hàng tối thiểu/
    );
  });

  test('Báo lỗi khi mã giảm giá đã hết lượt sử dụng', () => {
    const exhaustedCoupon = {
      ...baseValidCoupon,
      usedCount: 100,
      usageLimit: 100,
    };
    expect(() => calculateCouponDiscount(exhaustedCoupon, 500000)).toThrow(
      /hết lượt sử dụng/
    );
  });

  test('Báo lỗi khi mã giảm giá đã hết hạn', () => {
    const expiredCoupon = {
      ...baseValidCoupon,
      endDate: new Date(Date.now() - 3600000),
    };
    expect(() => calculateCouponDiscount(expiredCoupon, 500000)).toThrow(/hết hạn/);
  });
});
