// server/src/services/user.service.js
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');
const { uploadBufferToCloudinary } = require('../middlewares/uploadMiddleware');

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy người dùng');
  }
  return user;
};

const updateProfile = async (userId, payload, file) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  if (payload.fullName !== undefined) user.fullName = payload.fullName;
  if (payload.phone !== undefined) user.phone = payload.phone || null;

  if (file && file.buffer) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, 'calem-studio/avatars');
    user.avatarUrl = uploaded.imageUrl;
  }

  await user.save();
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  const isMatched = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatched) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Mật khẩu hiện tại không chính xác');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
};

const listUsers = async ({ page = 1, limit = 15, q, role }) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (q) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
      { phone: { [Op.like]: `%${q}%` } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const { rows, count } = await User.findAndCountAll({
    where,
    limit: Number(limit),
    offset: Number(offset),
    order: [['created_at', 'DESC']],
  });

  return {
    items: rows,
    meta: {
      page: Number(page),
      limit: Number(limit),
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const updateUserByAdmin = async (targetUserId, currentAdminId, { role, isActive }) => {
  const user = await User.findByPk(targetUserId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  if (Number(targetUserId) === Number(currentAdminId) && isActive === false) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Không thể tự khóa tài khoản của chính mình');
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();
  return user;
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  listUsers,
  updateUserByAdmin,
};
