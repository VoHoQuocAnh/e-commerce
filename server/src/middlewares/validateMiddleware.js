// server/src/middlewares/validateMiddleware.js
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const validateMiddleware = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const formattedErrors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return next(
          new ApiError(HTTP_CODES.UNPROCESSABLE_ENTITY, 'Dữ liệu đầu vào không hợp lệ', formattedErrors)
        );
      }
      next(error);
    }
  };
};

module.exports = validateMiddleware;
