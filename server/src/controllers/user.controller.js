// server/src/controllers/user.controller.js
const userService = require('../services/user.service');
const addressService = require('../services/address.service');
const ApiResponse = require('../utils/ApiResponse');

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return ApiResponse.success(res, { data: user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body, req.file);
    return ApiResponse.success(res, { message: 'Cập nhật hồ sơ thành công', data: user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user.id, req.body);
    return ApiResponse.success(res, { message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

const listMyAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.listAddresses(req.user.id);
    return ApiResponse.success(res, { data: addresses });
  } catch (err) {
    next(err);
  }
};

const createMyAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);
    return ApiResponse.created(res, 'Thêm địa chỉ thành công', address);
  } catch (err) {
    next(err);
  }
};

const updateMyAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
    return ApiResponse.success(res, { message: 'Cập nhật địa chỉ thành công', data: address });
  } catch (err) {
    next(err);
  }
};

const deleteMyAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.user.id, req.params.id);
    return ApiResponse.success(res, { message: 'Xóa địa chỉ thành công' });
  } catch (err) {
    next(err);
  }
};

const setDefaultMyAddress = async (req, res, next) => {
  try {
    const address = await addressService.setDefaultAddress(req.user.id, req.params.id);
    return ApiResponse.success(res, { message: 'Đã đặt làm địa chỉ mặc định', data: address });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  changePassword,
  listMyAddresses,
  createMyAddress,
  updateMyAddress,
  deleteMyAddress,
  setDefaultMyAddress,
};
