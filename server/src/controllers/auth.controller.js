// server/src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_CODES = require('../constants/httpCodes');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, 'Đăng ký tài khoản thành công', result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, { message: 'Đăng nhập thành công', data: result });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refreshToken(token);
    return ApiResponse.success(res, { message: 'Làm mới token thành công', data: result });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    await authService.logout(token);
    return ApiResponse.success(res, { statusCode: HTTP_CODES.OK, message: 'Đăng xuất thành công' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const data = await authService.forgotPassword(req.body.email);
    return ApiResponse.success(res, {
      message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    return ApiResponse.success(res, { message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
