// server/src/validations/wishlist.validation.js
const { z } = require('zod');

const toggleWishlistSchema = {
  body: z.object({
    productId: z.coerce.number().int().positive('Mã sản phẩm không hợp lệ'),
  }),
};

module.exports = {
  toggleWishlistSchema,
};
