// server/src/services/address.service.js
const { sequelize, Address } = require('../models');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const listAddresses = async (userId) => {
  return Address.findAll({
    where: { userId },
    order: [
      ['is_default', 'DESC'],
      ['created_at', 'DESC'],
    ],
  });
};

const createAddress = async (userId, payload) => {
  return sequelize.transaction(async (t) => {
    const existingCount = await Address.count({ where: { userId }, transaction: t });
    const shouldBeDefault = payload.isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.update({ isDefault: false }, { where: { userId }, transaction: t });
    }

    return Address.create(
      {
        ...payload,
        userId,
        isDefault: shouldBeDefault,
      },
      { transaction: t }
    );
  });
};

const updateAddress = async (userId, addressId, payload) => {
  return sequelize.transaction(async (t) => {
    const address = await Address.findOne({
      where: { id: addressId, userId },
      transaction: t,
    });
    if (!address) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy địa chỉ');
    }

    if (payload.isDefault === true) {
      await Address.update({ isDefault: false }, { where: { userId }, transaction: t });
    }

    await address.update(payload, { transaction: t });
    return address;
  });
};

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy địa chỉ');
  }
  const wasDefault = address.isDefault;
  await address.destroy();

  if (wasDefault) {
    const latest = await Address.findOne({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
    if (latest) {
      latest.isDefault = true;
      await latest.save();
    }
  }
};

const setDefaultAddress = async (userId, addressId) => {
  return sequelize.transaction(async (t) => {
    const address = await Address.findOne({
      where: { id: addressId, userId },
      transaction: t,
    });
    if (!address) {
      throw new ApiError(HTTP_CODES.NOT_FOUND, 'Không tìm thấy địa chỉ');
    }

    await Address.update({ isDefault: false }, { where: { userId }, transaction: t });
    address.isDefault = true;
    await address.save({ transaction: t });
    return address;
  });
};

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
