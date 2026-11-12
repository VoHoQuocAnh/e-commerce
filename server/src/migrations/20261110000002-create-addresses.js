// server/src/migrations/20261110000002-create-addresses.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      recipient_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      recipient_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      province: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ward: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      street_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('addresses', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('addresses');
  },
};
