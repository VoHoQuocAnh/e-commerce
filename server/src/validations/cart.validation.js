// server/src/validations/cart.validation.js
const { z } = require('zod');

const addToCartSchema = {
  body: z.object({
    productVariantId: z.coerce.number().int().positive('Biến thể sản phẩm không hợp lệ'),
    quantity: z.coerce.number().int().min(1, 'Số lượng tối thiểu là 1').max(99).default(1),
  }),
};

const updateCartItemSchema = {
  params: z.object({
    itemId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    quantity: z.coerce.number().int().min(1, 'Số lượng tối thiểu là 1').max(99),
  }),
};

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
