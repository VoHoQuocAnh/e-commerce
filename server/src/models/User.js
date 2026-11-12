// server/src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ROLES = require('../constants/roles');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    fullName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'full_name',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url',
    },
    role: {
      type: DataTypes.ENUM(ROLES.USER, ROLES.ADMIN),
      allowNull: false,
      defaultValue: ROLES.USER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reset_password_token',
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_password_expires',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.passwordHash;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpires;
  return values;
};

module.exports = User;
