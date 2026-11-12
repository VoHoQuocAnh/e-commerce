// server/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Vui lòng đăng nhập để tiếp tục');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Tài khoản không tồn tại');
    }
    if (!user.isActive) {
      throw new ApiError(HTTP_CODES.FORBIDDEN, 'Tài khoản của bạn đã bị khóa');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(HTTP_CODES.UNAUTHORIZED, 'Phiên đăng nhập đã hết hạn'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(HTTP_CODES.UNAUTHORIZED, 'Token xác thực không hợp lệ'));
    }
    next(error);
  }
};

module.exports = authMiddleware;
