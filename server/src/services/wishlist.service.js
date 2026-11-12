// server/src/services/wishlist.service.js
const { Wishlist, Product, ProductImage, ProductVariant } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const getWishlist = async (userId) => {
  const records = await Wishlist.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: 'product',
        where: { isActive: true },
        include: [
          {
            model: ProductImage,
            as: 'images',
            separate: true,
            order: [
              ['is_thumbnail', 'DESC'],
              ['sort_order', 'ASC'],
            ],
          },
          { model: ProductVariant, as: 'variants', separate: true },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return records.map((r) => r.product);
};

const toggleWishlist = async (userId, productId) => {
  const product = await Product.findByPk(productId);
  if (!product || !product.isActive) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }

  const existing = await Wishlist.findOne({ where: { userId, productId } });
  if (existing) {
    await existing.destroy();
    return { favorited: false, productId };
  }

  await Wishlist.create({ userId, productId });
  return { favorited: true, productId };
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
