// server/src/validations/coupon.validation.js
const { z } = require('zod');

const applyCouponSchema = {
  body: z.object({
    code: z.string().trim().min(2, 'Mã giảm giá không hợp lệ').max(50),
    subtotalAmount: z.coerce.number().min(0, 'Tổng tiền không hợp lệ'),
  }),
};

const createCouponSchema = {
  body: z.object({
    code: z
      .string()
      .trim()
      .min(3)
      .max(50)
      .transform((val) => val.toUpperCase()),
    description: z.string().trim().max(500).optional(),
    discountType: z.enum(['percent', 'fixed']),
    discountValue: z.coerce.number().positive(),
    minOrderAmount: z.coerce.number().min(0).default(0),
    maxDiscountAmount: z.coerce.number().positive().nullable().optional(),
    usageLimit: z.coerce.number().int().positive().default(100),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean().optional().default(true),
  }),
};

const updateCouponSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: createCouponSchema.body.partial(),
};

module.exports = {
  applyCouponSchema,
  createCouponSchema,
  updateCouponSchema,
};
