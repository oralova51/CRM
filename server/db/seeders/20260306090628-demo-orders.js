"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Orders", [
      {
        user_id: 2,
        price: 2000,
        status: "completed",
        payment_method: "card",
        discount_pct: 0,
        final_price: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        price: 5000,
        status: "completed",
        payment_method: "card",
        discount_pct: 5,
        final_price: 4750,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        price: 10000,
        status: "completed",
        payment_method: "cash",
        discount_pct: 5,
        final_price: 9500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        price: 15000,
        status: "pending",
        payment_method: "online",
        discount_pct: 10,
        final_price: 13500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};