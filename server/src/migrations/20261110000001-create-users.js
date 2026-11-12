// server/src/migrations/20261110000001-create-users.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      avatar_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      reset_password_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reset_password_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('users', ['phone']);
    await queryInterface.addIndex('users', ['role']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
