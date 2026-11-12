// server/src/middlewares/errorMiddleware.js
const env = require('../config/environment');
const HTTP_CODES = require('../constants/httpCodes');
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, _next) => {
  let statusCode = err.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Lỗi hệ thống nội bộ';
  let errors = err.errors || null;

  if (err.name === 'SequelizeValidationError') {
    statusCode = HTTP_CODES.UNPROCESSABLE_ENTITY;
    message = 'Dữ liệu không hợp lệ';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_CODES.CONFLICT;
    message = 'Dữ liệu đã tồn tại trong hệ thống';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'MulterError') {
    statusCode = HTTP_CODES.BAD_REQUEST;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Kích thước ảnh vượt quá giới hạn 5MB'
        : `Lỗi tải tệp lên: ${err.message}`;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, err);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message:
      env.NODE_ENV === 'production' && statusCode >= 500
        ? 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        : message,
    data: null,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};

module.exports = errorMiddleware;
