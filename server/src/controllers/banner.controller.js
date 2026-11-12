// server/src/controllers/banner.controller.js
const bannerService = require('../services/banner.service');
const ApiResponse = require('../utils/ApiResponse');

const listActiveBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.listActiveBanners();
    return ApiResponse.success(res, { data: banners });
  } catch (err) {
    next(err);
  }
};

const listAllBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.listAllBanners();
    return ApiResponse.success(res, { data: banners });
  } catch (err) {
    next(err);
  }
};

const createBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.createBanner(req.body, req.file);
    return ApiResponse.created(res, 'Tạo banner thành công', banner);
  } catch (err) {
    next(err);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body, req.file);
    return ApiResponse.success(res, { message: 'Cập nhật banner thành công', data: banner });
  } catch (err) {
    next(err);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    return ApiResponse.success(res, { message: 'Xóa banner thành công' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listActiveBanners,
  listAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
