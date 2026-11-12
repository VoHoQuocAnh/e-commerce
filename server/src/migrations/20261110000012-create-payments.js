// server/src/migrations/20261110000012-create-payments.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      provider: {
        type: Sequelize.ENUM('COD', 'MOMO'),
        allowNull: false,
      },
      request_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      pay_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      result_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      raw_response: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      paid_at: {
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

    await queryInterface.addIndex('payments', ['order_id']);
    await queryInterface.addIndex('payments', ['transaction_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  },
};
