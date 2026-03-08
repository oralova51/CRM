"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Measurements",
      [
        {
          user_id: 6,
          measured_at: new Date("2024-01-15"),
          // Антропометрические данные (все в сантиметрах)
          waist_cm: 85.5, // 📏 Окружность талии
          hips_cm: 98.0, // 📏 Окружность бедер (общая)
          hip_1: 57.5, // 🦵 Левое бедро (отдельно)
          chest_cm: 92.0, // 📏 Окружность груди
          arms_cm: 32.5, // 💪 Окружность рук (бицепс)
          // Фото
          photo_before: "/public/measurements/fat_1.jpeg",
          photo_after: "/public/measurements/to_1.jpeg",
          // Заметки
          notes: "Начальные замеры, левое бедро 57.5 см",
          created_by: 1,
        },
        {
          user_id: 6,
          measured_at: new Date("2024-02-15"),
          waist_cm: 82.0, // минус 3.5 см
          hips_cm: 97.0, // минус 1 см
          hip_1: 56.0, // минус 1.5 см (левое бедро)
          chest_cm: 92.5, // плюс 0.5 см
          arms_cm: 33.0, // плюс 0.5 см
          photo_before: "/public/measurements/fat_2.jpeg",
          photo_after: "/public/measurements/to_2.jpeg",
          notes: "Отличный прогресс! Левое бедро уменьшилось",
          created_by: 1,
        },
        {
          user_id: 6,
          measured_at: new Date("2024-01-20"),
          waist_cm: 78.0,
          hips_cm: 92.0,
          hip_1: 54.0, // левое бедро
          chest_cm: 88.0,
          arms_cm: 29.0,
          photo_before: "/public/measurements/fat_3.jpeg",
          photo_after: "/public/measurements/to_3.jpeg",
          notes: "Цель: увеличить бедра",
          created_by: 2,
        },
        {
          user_id: 6, // Третий клиент
          measured_at: new Date("2024-01-10"),
          waist_cm: 95.0,
          hips_cm: 108.0,
          hip_1: 62.0, // левое бедро (спортсмен)
          chest_cm: 105.0,
          arms_cm: 38.0,
          photo_before: "/public/measurements/fat_4.jpeg",
          photo_after: "/public/measurements/to_4.jpeg",
          notes: "Левое бедро мощное - 62 см",
          created_by: 1,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Measurements", null, {});
  },
};
