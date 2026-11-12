// server/src/services/review.service.js
const { sequelize, Review, Product, User } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ROLES = require('../constants/roles');
const ApiError = require('../utils/ApiError');
const productService = require('./product.service');

const recalculateProductRating = async (productId, transaction) => {
  const stats = await Review.findOne({
    where: { productId, isApproved: true },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('AVG', sequelize.col('rating')), 'avg'],
    ],
    raw: true,
    transaction,
  });

  const ratingCount = Number(stats?.count || 0);
  const ratingAvg = ratingCount > 0 ? Number(Number(stats.avg).toFixed(2)) : 0;

  await Product.update(
    { ratingCount, ratingAvg },
    { where: { id: productId }, transaction }
  );
};

const listReviewsByProduct = async (productId, { page = 1, limit = 10, rating }) => {
  const where = { productId, isApproved: true };
  if (rating) {
    where.rating = Number(rating);
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { rows, count } = await Review.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'avatarUrl'],
      },
    ],
    limit: Number(limit),
    offset,
    order: [['created_at', 'DESC']],
  });

  return {
    items: rows,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
    },
  };
};

const createReview = async (userId, { productId, orderId, rating, comment }) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy sản phẩm');
  }

  const review = await sequelize.transaction(async (t) => {
    const created = await Review.create(
      {
        userId,
        productId,
        orderId: orderId || null,
        rating,
        comment,
        isApproved: true,
      },
      { transaction: t }
    );
    await recalculateProductRating(productId, t);
    return created;
  });

  await productService.invalidateProductCache();
  return Review.findByPk(review.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'avatarUrl'] }],
  });
};

const deleteReview = async (reviewId, currentUser) => {
  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy đánh giá');
  }

  if (review.userId !== currentUser.id && currentUser.role !== ROLES.ADMIN) {
    throw new ApiError(HTTP_CODES.FORBIDDEN, 'Bạn không có quyền xóa đánh giá này');
  }

  const productId = review.productId;
  await sequelize.transaction(async (t) => {
    await review.destroy({ transaction: t });
    await recalculateProductRating(productId, t);
  });

  await productService.invalidateProductCache();
};

module.exports = {
  listReviewsByProduct,
  createReview,
  deleteReview,
};
