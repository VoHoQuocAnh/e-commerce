// server/src/services/banner.service.js
const { Banner } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../middlewares/uploadMiddleware');

const listActiveBanners = async () => {
  return Banner.findAll({
    where: { isActive: true },
    order: [
      ['sort_order', 'ASC'],
      ['created_at', 'DESC'],
    ],
  });
};

const listAllBanners = async () => {
  return Banner.findAll({
    order: [
      ['sort_order', 'ASC'],
      ['created_at', 'DESC'],
    ],
  });
};

const createBanner = async (payload, file) => {
  let imageUrl = payload.imageUrl || '';
  let publicId = null;

  if (file && file.buffer) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, 'calem-studio/banners');
    imageUrl = uploaded.imageUrl;
    publicId = uploaded.publicId;
  }

  if (!imageUrl) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Vui lòng cung cấp ảnh banner');
  }

  return Banner.create({
    title: payload.title,
    subtitle: payload.subtitle || null,
    imageUrl,
    publicId,
    linkUrl: payload.linkUrl || '/products',
    sortOrder: payload.sortOrder ?? 0,
    isActive: payload.isActive ?? true,
  });
};

const updateBanner = async (id, payload, file) => {
  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy banner');
  }

  const updateData = { ...payload };
  if (file && file.buffer) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, 'calem-studio/banners');
    if (banner.publicId) {
      await deleteFromCloudinary(banner.publicId);
    }
    updateData.imageUrl = uploaded.imageUrl;
    updateData.publicId = uploaded.publicId;
  }

  await banner.update(updateData);
  return banner;
};

const deleteBanner = async (id) => {
  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy banner');
  }
  if (banner.publicId) {
    await deleteFromCloudinary(banner.publicId);
  }
  await banner.destroy();
};

module.exports = {
  listActiveBanners,
  listAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
