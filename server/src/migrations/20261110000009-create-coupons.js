// server/src/migrations/20261110000009-create-coupons.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discount_type: {
        type: Sequelize.ENUM('percent', 'fixed'),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      min_order_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      max_discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      usage_limit: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 100,
      },
      used_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('coupons', ['is_active', 'start_date', 'end_date']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('coupons');
  },
};
