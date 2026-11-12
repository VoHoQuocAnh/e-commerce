// server/src/services/auth.service.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sequelize, User, Cart } = require('../models');
const env = require('../config/environment');
const HTTP_CODES = require('../constants/httpCodes');
const ROLES = require('../constants/roles');
const ApiError = require('../utils/ApiError');
const cacheService = require('./cache.service');
const emailService = require('./email.service');

const REFRESH_BLACKLIST_PREFIX = 'bl_refresh:';

const signTokens = (user) => {
  const payload = { userId: user.id, role: user.role };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

const getRemainingTtlSeconds = (decoded) => {
  if (!decoded || !decoded.exp) return 7 * 24 * 3600;
  const remaining = decoded.exp - Math.floor(Date.now() / 1000);
  return Math.max(remaining, 60);
};

const register = async ({ email, password, fullName, phone }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(HTTP_CODES.CONFLICT, 'Email này đã được sử dụng');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await sequelize.transaction(async (t) => {
    const createdUser = await User.create(
      {
        email,
        passwordHash,
        fullName,
        phone: phone || null,
        role: ROLES.USER,
      },
      { transaction: t }
    );

    await Cart.create({ userId: createdUser.id }, { transaction: t });
    return createdUser;
  });

  const tokens = signTokens(user);
  return { user, ...tokens };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Email hoặc mật khẩu không chính xác');
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_CODES.FORBIDDEN, 'Tài khoản của bạn đã bị khóa');
  }

  const isMatched = await bcrypt.compare(password, user.passwordHash);
  if (!isMatched) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Email hoặc mật khẩu không chính xác');
  }

  const tokens = signTokens(user);
  return { user, ...tokens };
};

const refreshToken = async (token) => {
  if (!token) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Thiếu refresh token');
  }

  const isBlacklisted = await cacheService.get(`${REFRESH_BLACKLIST_PREFIX}${token}`);
  if (isBlacklisted) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Refresh token đã bị thu hồi');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Refresh token không hợp lệ hoặc đã hết hạn');
  }

  const user = await User.findByPk(decoded.userId);
  if (!user || !user.isActive) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, 'Tài khoản không hợp lệ hoặc đã bị khóa');
  }

  // Rotate refresh token: blacklist the old one
  const ttl = getRemainingTtlSeconds(decoded);
  await cacheService.set(`${REFRESH_BLACKLIST_PREFIX}${token}`, true, ttl);

  const tokens = signTokens(user);
  return { user, ...tokens };
};

const logout = async (token) => {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const ttl = getRemainingTtlSeconds(decoded);
    await cacheService.set(`${REFRESH_BLACKLIST_PREFIX}${token}`, true, ttl);
  } catch {
    // Token already invalid or expired; ignore
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Avoid user enumeration
    return { sent: true };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  await emailService.sendResetPasswordEmail(user.email, user.fullName, rawToken);
  return {
    sent: true,
    ...(env.NODE_ENV === 'development' ? { devResetToken: rawToken } : {}),
  };
};

const resetPassword = async ({ token, newPassword }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
