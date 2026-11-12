// server/src/controllers/wishlist.controller.js
const wishlistService = require('../services/wishlist.service');
const ApiResponse = require('../utils/ApiResponse');

const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.getWishlist(req.user.id);
    return ApiResponse.success(res, { data: items });
  } catch (err) {
    next(err);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const result = await wishlistService.toggleWishlist(req.user.id, req.body.productId);
    return ApiResponse.success(res, {
      message: result.favorited ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ khỏi danh sách yêu thích',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
