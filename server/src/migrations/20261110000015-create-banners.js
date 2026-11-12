// server/src/migrations/20261110000015-create-banners.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('banners', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      link_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('banners', ['is_active', 'sort_order']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('banners');
  },
};
