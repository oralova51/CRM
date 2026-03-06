"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      procedure_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Procedures",
          key: "id",
        },
      },
      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      price_paid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Сначала нужно удалить ENUM тип, потом таблицу
    await queryInterface.dropTable("Bookings");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Bookings_status";',
    );
  },
};
