// server/src/models/Address.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define(
  'Address',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    recipientName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'recipient_name',
    },
    recipientPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'recipient_phone',
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    streetAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'street_address',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_default',
    },
  },
  {
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Address;
