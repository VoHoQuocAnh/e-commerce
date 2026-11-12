// server/src/middlewares/roleMiddleware.js
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_CODES.UNAUTHORIZED, 'Chưa xác thực người dùng'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(HTTP_CODES.FORBIDDEN, 'Bạn không có quyền truy cập chức năng này'));
    }
    next();
  };
};

module.exports = roleMiddleware;
