// server/src/controllers/review.controller.js
const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/ApiResponse');

const listReviewsByProduct = async (req, res, next) => {
  try {
    const { items, meta } = await reviewService.listReviewsByProduct(req.params.productId, req.query);
    return ApiResponse.success(res, { data: items, meta });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    return ApiResponse.created(res, 'Gửi đánh giá thành công', review);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user);
    return ApiResponse.success(res, { message: 'Xóa đánh giá thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listReviewsByProduct,
  createReview,
  deleteReview,
};
