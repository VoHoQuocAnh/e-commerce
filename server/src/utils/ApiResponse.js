// server/src/utils/ApiResponse.js
const HTTP_CODES = require('../constants/httpCodes');

class ApiResponse {
  static success(res, { statusCode = HTTP_CODES.OK, message = 'Thành công', data = null, meta } = {}) {
    const payload = {
      success: true,
      message,
      data,
    };
    if (meta !== undefined) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static created(res, message = 'Tạo mới thành công', data = null) {
    return ApiResponse.success(res, {
      statusCode: HTTP_CODES.CREATED,
      message,
      data,
    });
  }
}

module.exports = ApiResponse;
