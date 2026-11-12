// server/src/validations/order.validation.js
const { z } = require('zod');
const { ORDER_STATUS } = require('../constants/orderStatus');
const { PAYMENT_METHODS } = require('../constants/paymentStatus');

const createOrderSchema = {
  body: z.object({
    addressId: z.coerce.number().int().positive().optional(),
    recipientName: z.string().trim().min(2).max(120).optional(),
    recipientPhone: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
      .optional(),
    shippingAddress: z.string().trim().min(5).max(500).optional(),
    note: z.string().trim().max(500).optional(),
    paymentMethod: z.enum([PAYMENT_METHODS.COD, PAYMENT_METHODS.MOMO]),
    couponCode: z.string().trim().max(50).optional().nullable(),
  }),
};

const cancelOrderSchema = {
  params: z.object({
    orderCode: z.string().trim().min(3),
  }),
  body: z.object({
    reason: z.string().trim().max(255).optional().default('Khách hàng chủ động hủy đơn'),
  }),
};

const adminUpdateOrderStatusSchema = {
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    orderStatus: z.enum([
      ORDER_STATUS.PENDING_PAYMENT,
      ORDER_STATUS.PENDING_CONFIRMATION,
      ORDER_STATUS.SHIPPING,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ]),
    cancelReason: z.string().trim().max(255).optional(),
  }),
};

module.exports = {
  createOrderSchema,
  cancelOrderSchema,
  adminUpdateOrderStatusSchema,
};
