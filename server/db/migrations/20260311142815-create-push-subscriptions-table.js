// server/db/migrations/XXXXXXXXXXXXXX-create-push-subscriptions-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PushSubscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      endpoint: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      p256dh: {
        type: Sequelize.STRING,
        allowNull: false
      },
      auth: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Добавляем индексы для быстрого поиска
    await queryInterface.addIndex('PushSubscriptions', ['user_id']);
    await queryInterface.addIndex('PushSubscriptions', ['endpoint']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PushSubscriptions');
  }
};