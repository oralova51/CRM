"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Measurements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      measured_at: {
        type: Sequelize.DATE,
      },
      waist_cm: {
        type: Sequelize.DECIMAL(5, 2),
      },
      hips_cm: {
        type: Sequelize.DECIMAL(5, 2),
      },
      hip_1: {
        type: Sequelize.DECIMAL(5, 2),
      },
      chest_cm: {
        type: Sequelize.DECIMAL(5, 2),
      },
      arms_cm: {
        type: Sequelize.DECIMAL(5, 2),
      },
      photo_before: {
        type: Sequelize.STRING,
      },
      photo_after: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Measurements");
  },
};
