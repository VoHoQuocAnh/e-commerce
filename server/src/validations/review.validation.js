// server/src/validations/review.validation.js
const { z } = require('zod');

const createReviewSchema = {
  body: z.object({
    productId: z.coerce.number().int().positive(),
    orderId: z.coerce.number().int().positive().optional().nullable(),
    rating: z.coerce.number().int().min(1, 'Đánh giá từ 1 đến 5 sao').max(5),
    comment: z.string().trim().max(2000).optional().default(''),
  }),
};

const listReviewsSchema = {
  params: z.object({
    productId: z.coerce.number().int().positive(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  }),
};

module.exports = {
  createReviewSchema,
  listReviewsSchema,
};
