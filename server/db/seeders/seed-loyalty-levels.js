"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("LoyaltyLevels", [
      {
        name: "Bronze",
        min_spent: 10000,
        discount_pct: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Silver",
        min_spent: 30000,
        discount_pct: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gold",
        min_spent: 50000,
        discount_pct: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Platinum",
        min_spent: 80000,
        discount_pct: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("LoyaltyLevels", null, {});
  },
};