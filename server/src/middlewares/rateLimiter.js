// server/src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const HTTP_CODES = require('../constants/httpCodes');

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(HTTP_CODES.TOO_MANY_REQUESTS).json({
        success: false,
        message,
        data: null,
      });
    },
  });

const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Bạn đã gửi quá nhiều yêu cầu đăng nhập/khôi phục mật khẩu. Vui lòng thử lại sau 15 phút.',
});

const apiRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.',
});

module.exports = {
  authRateLimiter,
  apiRateLimiter,
};
