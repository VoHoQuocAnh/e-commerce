// server/src/migrations/20261110000010-create-orders.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      coupon_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'coupons', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      recipient_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      recipient_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      shipping_address: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      subtotal_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('COD', 'MOMO'),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      order_status: {
        type: Sequelize.ENUM(
          'pending_payment',
          'pending_confirmation',
          'shipping',
          'completed',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending_confirmation',
      },
      cancel_reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      expired_at: {
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

    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['order_status']);
    await queryInterface.addIndex('orders', ['payment_status']);
    await queryInterface.addIndex('orders', ['expired_at']);
    await queryInterface.addIndex('orders', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  },
};
